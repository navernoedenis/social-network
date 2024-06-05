import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/files/entities';

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
}

export const usersService = new UsersService();
