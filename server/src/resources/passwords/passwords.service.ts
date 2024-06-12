import { eq } from 'drizzle-orm';
import { type Password } from '@/db/files/models';
import { db } from '@/db';
import { passwords } from '@/db/files/entities';

class PasswordsService {
  async getPassword(userId: number) {
    const password = await db.query.passwords.findFirst({
      where: eq(passwords.userId, userId),
    });

    return password as Password;
  }

  async updatePassword(userId: number, newPassword: string) {
    await db
      .update(passwords)
      .set({ hash: newPassword })
      .where(eq(passwords.userId, userId));
  }
}

export const passwordsService = new PasswordsService();
