import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/files/entities';

type WithConfig = {
  withProfile?: boolean;
  withSettings?: boolean;
};

class UsersService {
  async findOne(email: string, config: WithConfig = {}) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        ...(config.withProfile && { profile: true }),
        ...(config.withSettings && { settings: true }),
      },
    });

    return user;
  }
}

export const usersService = new UsersService();
