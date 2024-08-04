import { eq, or, like } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { userSearchCache, usersOnlineCache, usersCache } from './users.cache';
import { type UpdateFields } from './users.types';

class UsersService {
  async getById(id: number) {
    const cacheData = await usersCache.getById(id);
    if (cacheData) return cacheData;

    const user = await db.query.users.findFirst({
      where: eq(entities.users.id, id),
      with: {
        profile: true,
        settings: true,
      },
    });

    if (user) {
      await usersCache.createOne(user);
    }

    return user;
  }

  async getByEmail(email: string) {
    const cacheData = await usersCache.getByEmail(email);
    if (cacheData) return cacheData;

    const user = await db.query.users.findFirst({
      where: eq(entities.users.email, email),
    });

    if (!user) return null;
    return this.getById(user.id);
  }

  async getByUsername(username: string) {
    const cacheData = await usersCache.getByUsername(username);
    if (cacheData) return cacheData;

    const user = await db.query.users.findFirst({
      where: eq(entities.users.username, username),
    });

    if (!user) return null;
    return this.getById(user.id);
  }

  async updateOne(userId: number, fields: UpdateFields) {
    await db
      .update(entities.users)
      .set(fields)
      .where(eq(entities.users.id, userId));

    const updatedData = await db.query.users.findFirst({
      where: eq(entities.users.id, userId),
      with: {
        profile: true,
        settings: true,
      },
    });

    if (updatedData) {
      await usersCache.createOne(updatedData);
    }

    return updatedData;
  }

  async deleteOne(userId: number) {
    const [user] = await db
      .delete(entities.users)
      .where(eq(entities.users.id, userId))
      .returning();

    if (user) {
      await usersCache.deleteOne(user);
    }

    return user;
  }
}

class UsersSearchService {
  async getMany(search: string) {
    const cacheData = await userSearchCache.getMany(search);
    if (cacheData) return cacheData;

    const searchSQL = or(
      like(entities.users.email, `%${search}%`),
      like(entities.users.firstname, `%${search}%`),
      like(entities.users.lastname, `%${search}%`),
      like(entities.users.username, `%${search}%`)
    );

    const users = await db.query.users.findMany({
      where: search ? searchSQL : undefined,
      with: {
        profile: true,
        settings: true,
      },
      limit: 10,
    });

    await userSearchCache.createOne(search, users);
    return users;
  }
}

class UsersOnlineService {
  async setOnline(userId: number) {
    await usersOnlineCache.createOne(userId);
  }

  async isOnline(userId: number) {
    return usersOnlineCache.isOnline(userId);
  }

  async setOffline(userId: number) {
    await usersOnlineCache.deleteOne(userId);
  }
}

export const usersOnlineService = new UsersOnlineService();
export const usersSearchService = new UsersSearchService();
export const usersService = new UsersService();
