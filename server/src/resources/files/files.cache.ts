import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type File } from '@/db/files/models';

class FilesCache extends CacheService {
  async createOne(file: File) {
    const key = `files:${file.id}`;
    await this.create(key, file, CACHE_EX.DAYS(90));
  }

  async getOne(id: number) {
    const key = `files:${id}`;
    return this.get<File>(key);
  }

  async deleteOne(id: number) {
    const key = `files:${id}`;
    await this.delete(key);
  }
}

export const filesCache = new FilesCache();
