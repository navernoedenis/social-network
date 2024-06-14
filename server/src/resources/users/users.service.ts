import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/files/entities';
import {
  type FindKey,
  type UpdateFields,
  type WithConfig,
} from './users.types';

class UsersService {
  async findById(id: number, config: WithConfig = {}) {
    return this.findOne('id', id, config);
  }

  async findByEmail(email: string, config: WithConfig = {}) {
    return this.findOne('email', email, config);
  }

  async findByUsername(username: string, config: WithConfig = {}) {
    return this.findOne('username', username, config);
  }

  async updateFields(userId: number, fields: UpdateFields) {
    return db.update(users).set(fields).where(eq(users.id, userId)).returning();
  }

  async deleteUser(userId: number) {
    const [user] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

  private async findOne(
    key: FindKey,
    value: string | number,
    config: WithConfig = {}
  ) {
    const user = await db.query.users.findFirst({
      where: eq(users[key], value),
      with: {
        ...(config.withProfile && { profile: true }),
        ...(config.withSettings && { settings: true }),
      },
    });

    return user;
  }
}

export const usersService = new UsersService();
