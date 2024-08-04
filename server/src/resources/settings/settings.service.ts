import { eq } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { settingsCache } from './settings.cache';

class SettingsService {
  async getOne(userId: number) {
    const cacheData = await settingsCache.getOne(userId);
    if (cacheData) return cacheData;

    const setting = await db.query.settings.findFirst({
      where: eq(entities.settings.userId, userId),
    });

    const settingsData = setting!;
    await settingsCache.createOne(userId, settingsData);
    return settingsData;
  }
}

export const settingsService = new SettingsService();
