import { eq } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { passwordsCache } from './passwords.cache';

class PasswordsService {
  async getOne(userId: number) {
    const cacheData = await passwordsCache.getOne(userId);
    if (cacheData) return cacheData;

    const password = await db.query.passwords.findFirst({
      where: eq(entities.passwords.userId, userId),
    });

    const passwordData = password!;
    await passwordsCache.createOne(passwordData);
    return passwordData;
  }

  async updateOne(userId: number, hash: string) {
    const [updatedPassword] = await db
      .update(entities.passwords)
      .set({ hash })
      .where(eq(entities.passwords.userId, userId))
      .returning();

    await passwordsCache.createOne(updatedPassword);
    return updatedPassword;
  }
}

export const passwordsService = new PasswordsService();
