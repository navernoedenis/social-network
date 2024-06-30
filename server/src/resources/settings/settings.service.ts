import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type Setting } from '@/db/files/models';

import * as entities from '@/db/files/entities';

class SettingService {
  async getOne(userId: number) {
    const setting = await db.query.settings.findFirst({
      where: eq(entities.settings.userId, userId),
    });

    return setting as Setting;
  }
}

export const settingsService = new SettingService();
