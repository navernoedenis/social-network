import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type UserData } from './users.types';

class UsersCache extends CacheService {
  async createOne(data: UserData) {
    const ex = CACHE_EX.DAYS(90);
    await Promise.all([
      this.create(`users:id:${data.id}`, data, ex),
      this.create(`users:email:${data.email}`, data.id, ex),
      this.create(`users:username:${data.username}`, data.id, ex),
    ]);
  }

  async getById(id: number) {
    const key = `users:id:${id}`;
    return this.get<UserData>(key);
  }

  async getByUsername(username: string) {
    const key = `users:username:${username}`;
    const userId = await this.get<number>(key);
    if (!userId) return null;
    return this.getById(userId);
  }

  async getByEmail(email: string) {
    const key = `users:email:${email}`;
    const userId = await this.get<number>(key);
    if (!userId) return null;
    return this.getById(userId);
  }

  async deleteOne(data: { id: number; email: string; username: string }) {
    await Promise.all([
      this.delete(`users:id:${data.id}`),
      this.delete(`users:email:${data.email}`),
      this.delete(`users:username:${data.username}`),
    ]);
  }
}

class UsersOnlineCache extends CacheService {
  async createOne(userId: number) {
    const key = `users:online:${userId}`;
    const ex = CACHE_EX.MINUTES(5);
    await this.create(key, true, ex);
  }

  async deleteOne(userId: number) {
    const key = `users:online:${userId}`;
    await this.delete(key);
  }

  async isOnline(userId: number) {
    const key = `users:online:${userId}`;
    const online = await this.get<boolean>(key);
    return online ? online : false;
  }
}

class UserSearchCache extends CacheService {
  async createOne(search: string, data: UserData[]) {
    const key = `users:search:${search}`;
    const ex = CACHE_EX.HOURS(12);
    await this.create(key, data, ex);
  }

  async getMany(search: string) {
    const key = `users:search:${search}`;
    return this.get<UserData[]>(key);
  }

  async deleteOne(search: string) {
    const key = `users:search:${search}`;
    await this.delete(key);
  }
}

export const usersCache = new UsersCache();
export const usersOnlineCache = new UsersOnlineCache();
export const userSearchCache = new UserSearchCache();
