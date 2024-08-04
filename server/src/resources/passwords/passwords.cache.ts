import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type Password } from '@/db/files/models';

class PasswordsCache extends CacheService {
  async createOne(data: Password) {
    const key = `password:user:${data.userId}`;
    await this.create(key, data, CACHE_EX.DAYS(90));
  }

  async getOne(userId: number) {
    const key = `password:user:${userId}`;
    return this.get<Password>(key);
  }

  async deleteOne(userId: number) {
    const key = `password:user:${userId}`;
    await this.delete(key);
  }
}

export const passwordsCache = new PasswordsCache();
