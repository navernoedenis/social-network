import { eq, or, like } from 'drizzle-orm';
import { db } from '@/db';
import {
  type FindKey,
  type UpdateFields,
  type WithConfig,
} from './users.types';

import * as entities from '@/db/files/entities';

class UsersService {
  async getOne(key: FindKey, value: string | number, config: WithConfig = {}) {
    const user = await db.query.users.findFirst({
      where: eq(entities.users[key], value),
      with: {
        ...(config.withProfile && { profile: true }),
        ...(config.withSettings && { settings: true }),
      },
    });

    return user;
  }

  async getMany(word: string, config: WithConfig & { limit?: number } = {}) {
    const { limit = 10 } = config;
    const key = `%${word}%`;

    return db.query.users.findMany({
      where: or(
        like(entities.users.email, key),
        like(entities.users.firstname, key),
        like(entities.users.lastname, key),
        like(entities.users.username, key)
      ),
      with: {
        ...(config.withProfile && { profile: true }),
        ...(config.withSettings && { settings: true }),
      },
      limit,
    });
  }

  async getById(id: number, config: WithConfig = {}) {
    return this.getOne('id', id, config);
  }

  async getByEmail(email: string, config: WithConfig = {}) {
    return this.getOne('email', email, config);
  }

  async getByUsername(username: string, config: WithConfig = {}) {
    return this.getOne('username', username, config);
  }

  async updateOne(userId: number, fields: UpdateFields) {
    return db
      .update(entities.users)
      .set(fields)
      .where(eq(entities.users.id, userId))
      .returning();
  }

  async deleteOne(userId: number) {
    const [user] = await db
      .delete(entities.users)
      .where(eq(entities.users.id, userId))
      .returning();

    return user;
  }
}

export const usersService = new UsersService();
