import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { settings } from '@/db/files/entities';
import { type Setting } from '@/db/files/models';

class SettingService {
  async getSettings(userId: number) {
    const setting = await db.query.settings.findFirst({
      where: eq(settings.userId, userId),
    });

    return setting as Setting;
  }
}

export const settingsService = new SettingService();
