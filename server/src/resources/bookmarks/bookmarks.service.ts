import { and, desc, eq, SQL } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';
import { bookmarkTypes } from '@/utils/constants';
import { type BookmarkData } from './bookmarks.types';

class BookmarksService {
  async createOne(data: BookmarkData) {
    const [newBookmark] = await db
      .insert(entities.bookmarks)
      .values(data)
      .returning();

    return newBookmark;
  }

  async getOne(data: Partial<BookmarkData>) {
    const bookmark = await db.query.bookmarks.findFirst({
      where: this.createClauses(data),
    });

    return bookmark ?? null;
  }

  async getMany(data: {
    page: number;
    limit: number;
    entity?: (typeof bookmarkTypes)[number];
    userId?: number;
  }) {
    const { page, limit } = data;

    return db.query.bookmarks.findMany({
      limit,
      offset: limit * page - limit,
      orderBy: [desc(entities.bookmarks.createdAt)],
      where: this.createClauses(data),
    });
  }

  async deleteOne(data: BookmarkData) {
    const [deletedBookmark] = await db
      .delete(entities.bookmarks)
      .where(this.createClauses(data))
      .returning();

    return deletedBookmark ? deletedBookmark : null;
  }

  private createClauses(data: Partial<BookmarkData> = {}) {
    const clauses: SQL[] = [];

    if (data.entity) {
      clauses.push(eq(entities.bookmarks.entity, data.entity));
    }

    if (data.entityId) {
      clauses.push(eq(entities.bookmarks.entityId, data.entityId));
    }

    if (data.userId) {
      clauses.push(eq(entities.bookmarks.userId, data.userId));
    }

    return and(...clauses);
  }
}

export const bookmarksService = new BookmarksService();
