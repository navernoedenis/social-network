import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type Setting } from '@/db/files/models';

class SettingsCache extends CacheService {
  async createOne(userId: number, settings: Setting) {
    const key = `settings:user:${userId}`;
    const ex = CACHE_EX.DAYS(30);
    await this.create(key, settings, ex);
  }

  async getOne(userId: number) {
    const key = `settings:user:${userId}`;
    return this.get<Setting>(key);
  }

  async deteleOne(userId: number) {
    const key = `settings:user:${userId}`;
    await this.delete(key);
  }
}

export const settingsCache = new SettingsCache();
