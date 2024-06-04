import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users, passwords } from '@/db/files/entities';
import { type Password } from '@/db/files/models';

class UsersService {
  async findOne(email: string, config: { withProfile?: boolean } = {}) {
    const { withProfile } = config;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        ...(withProfile && { profile: true }),
      },
    });

    return user;
  }

  async getUserPassword(userId: number) {
    const password = await db.query.passwords.findFirst({
      where: eq(passwords.userId, userId),
    });

    return password as Password;
  }
}

export const usersService = new UsersService();
