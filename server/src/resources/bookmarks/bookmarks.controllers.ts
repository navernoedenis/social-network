import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { postsService } from '@/resources/posts';
import { httpStatus } from '@/utils/constants';
import { paginateQuery } from '@/utils/helpers';

import { bookmarksService } from './bookmarks.service';
import { type BookmarkData, type BookmarkDto } from './bookmarks.types';

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

    const bookmark = await bookmarksService.getOne(bookmarkData);
    let message = '';

    if (bookmark) {
      await bookmarksService.deleteOne(bookmarkData);
      message = `You have removed ${dto.entity} from yours bookmarks 🫛`;
    } else {
      await bookmarksService.createOne(bookmarkData);
      message = `You have added ${dto.entity} to yours bookmarks 🥑`;
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: !bookmark,
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
    defaultLimit: 3,
  });

  try {
    const bookmarks = await bookmarksService.getMany({
      limit,
      page,
      userId: me.id,
    });

    // we may have different bookmarks in the future
    const bookmarksData: unknown[] = [];

    for (const bookmark of bookmarks) {
      if (bookmark.entity === 'post') {
        const post = await postsService.getOne(bookmark.entityId, me.id);
        bookmarksData.push(post);
      }
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: bookmarksData,
      message: 'Here is your bookmarks 🫑',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
