import { eq } from 'drizzle-orm';
import { type Password } from '@/db/files/models';
import { db } from '@/db';

import * as entities from '@/db/files/entities';

class PasswordsService {
  async getOne(userId: number) {
    const password = await db.query.passwords.findFirst({
      where: eq(entities.passwords.userId, userId),
    });

    return password as Password;
  }

  async updateOne(userId: number, hash: string) {
    await db
      .update(entities.passwords)
      .set({ hash })
      .where(eq(entities.passwords.userId, userId));
  }
}

export const passwordsService = new PasswordsService();
