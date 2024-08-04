import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { type BookmarkData, type BookmarksParams } from './bookmarks.types';
import { bookmarksCache } from './bookmarks.cache';

class BookmarksService {
  async toggleOne(data: BookmarkData) {
    await bookmarksCache.deleteMany(data.userId);

    const bookmarkSQL = and(
      eq(entities.bookmarks.userId, data.userId),
      eq(entities.bookmarks.entity, data.entity),
      eq(entities.bookmarks.entityId, data.entityId)
    );

    const bookmark = await db.query.bookmarks.findFirst({
      where: bookmarkSQL,
    });

    if (bookmark) {
      await db.delete(entities.bookmarks).where(bookmarkSQL);
      return null;
    }

    const [newBookmark] = await db
      .insert(entities.bookmarks)
      .values(data)
      .returning();

    return newBookmark;
  }

  async getMany(params: BookmarksParams) {
    const { userId, page, limit } = params;

    const cacheData = await bookmarksCache.getMany({
      type: 'refs',
      ...params,
    });

    if (cacheData) return cacheData;

    const bookmarks = await db.query.bookmarks.findMany({
      limit,
      offset: limit * page - limit,
      orderBy: [desc(entities.bookmarks.createdAt)],
      where: eq(entities.bookmarks.userId, userId),
    });

    await bookmarksCache.createMany({
      type: 'refs',
      bookmarks,
      ...params,
    });

    return bookmarks;
  }
}

export const bookmarksService = new BookmarksService();
