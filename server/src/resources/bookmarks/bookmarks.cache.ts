import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type Bookmark } from '@/db/files/models';
import { type BookmarksParams } from './bookmarks.types';

type DataType = 'refs' | 'data';

type BookmarskType =
  | { type: 'data'; bookmarks: unknown }
  | { type: 'refs'; bookmarks: Bookmark[] };

class BookmarksCache extends CacheService {
  async createMany(params: BookmarksParams & BookmarskType) {
    const { userId, page, limit, bookmarks, type } = params;
    const key = `bookmarks:user:${userId}:${type}:page:${page}:limit${limit}`;
    await this.create(key, bookmarks, CACHE_EX.DAYS(7));
  }

  async getMany(params: BookmarksParams & { type: DataType }) {
    const { userId, page, limit, type } = params;
    const key = `bookmarks:user:${userId}:${type}:page:${page}:limit${limit}`;
    return this.get<Bookmark[]>(key);
  }

  async deleteMany(userId: number) {
    const key = `bookmarks:user:${userId}`;
    await this.delete(key, 'nested');
  }
}

export const bookmarksCache = new BookmarksCache();
