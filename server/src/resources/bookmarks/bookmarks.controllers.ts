import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { postsService } from '@/resources/posts';

import { httpStatus } from '@/utils/constants';
import { NotFound, paginateQuery } from '@/utils/helpers';

import { bookmarksService } from './bookmarks.service';
import { type BookmarkDto } from './bookmarks.types';

export const createBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const dto = req.body as BookmarkDto;

  try {
    const bookmark = await bookmarksService.createOne({
      entity: dto.entity,
      entityId: dto.entityId,
      userId: user.id,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: bookmark,
      message: 'You have added entity to yours bookmarks 🥑',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (
  req: Request<unknown, unknown, unknown, { page: string; limit: string }>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;

  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 3,
  });

  try {
    const bookmarks = await bookmarksService.getMany({
      limit,
      page,
      userId: user.id,
    });

    // we may have different bookmarks in the future
    const bookmarksData: unknown[] = [];

    for (const bookmark of bookmarks) {
      if (bookmark.entity === 'post') {
        const post = await postsService.getOne(bookmark.entityId, user.id);
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

export const deleteBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const dto = req.body as BookmarkDto;

  try {
    const bookmark = await bookmarksService.deleteOne({
      entity: dto.entity,
      entityId: dto.entityId,
      userId: user.id,
    });

    if (!bookmark) {
      throw new NotFound("Bookmark doesn't exist");
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: bookmark,
      message: 'You have removed your bookmark 🪔',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
