import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { postsService } from '@/resources/posts';

import { httpStatus } from '@/utils/constants';
import { paginateQuery } from '@/utils/helpers';

import { bookmarksCache } from './bookmarks.cache';
import { bookmarksService } from './bookmarks.service';
import {
  type BookmarkData,
  type BookmarkDto,
  type BookmarksParams,
} from './bookmarks.types';

export const toggleBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as BookmarkDto;

  try {
    const bookmarkData: BookmarkData = {
      entity: dto.entity,
      entityId: dto.entityId,
      userId: me.id,
    };

    const bookmark = await bookmarksService.toggleOne(bookmarkData);
    let message = '';

    if (bookmark) {
      message = `You have added ${dto.entity} to yours bookmarks 🥑`;
    } else {
      message = `You have removed ${dto.entity} from yours bookmarks 🫛`;
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: !!bookmark,
      message,
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 5,
  });

  try {
    const bookmarksParams: BookmarksParams = {
      userId: me.id,
      page,
      limit,
    };

    const cacheBookmarksData = await bookmarksCache.getMany({
      type: 'data',
      ...bookmarksParams,
    });

    const bookmarksData: unknown[] = [];

    if (!cacheBookmarksData) {
      const bookmarks = await bookmarksService.getMany(bookmarksParams);

      for (const bookmark of bookmarks) {
        if (bookmark.entity === 'post') {
          const post = await postsService.getOne(bookmark.entityId, me.id);
          if (post) bookmarksData.push(post);
        }
      }

      await bookmarksCache.createMany({
        type: 'data',
        bookmarks: bookmarksData,
        ...bookmarksParams,
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: cacheBookmarksData ? cacheBookmarksData : bookmarksData,
      message: 'Here is your bookmarks 🫑',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
