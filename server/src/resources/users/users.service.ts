import { eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  type FindKey,
  type UpdateFields,
  type WithConfig,
} from './users.types';

import * as entities from '@/db/files/entities';

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

  private async findOne(
    key: FindKey,
    value: string | number,
    config: WithConfig = {}
  ) {
    const user = await db.query.users.findFirst({
      where: eq(entities.users[key], value),
      with: {
        ...(config.withProfile && { profile: true }),
        ...(config.withSettings && { settings: true }),
      },
    });

    return user;
  }
}

export const usersService = new UsersService();
