import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type Profile } from '@/db/files/models';

class ProfilesCache extends CacheService {
  async createOne(profile: Profile) {
    const key = `profiles:user:${profile.id}`;
    const ex = CACHE_EX.DAYS(90);
    await this.create(key, profile, ex);
  }

  async getOne(userId: number) {
    const key = `profiles:user:${userId}`;
    return this.get<Profile>(key);
  }

  async deleteOne(userId: number) {
    const key = `profiles:user:${userId}`;
    await this.delete(key);
  }
}

export const profilesCache = new ProfilesCache();
