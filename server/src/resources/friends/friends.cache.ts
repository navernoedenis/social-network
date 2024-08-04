import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';
import { type Friend, type User } from '@/db/files/models';

import { type FriendsParams, type RequestStatus } from './friends.types';

class FriendsCache extends CacheService {
  async getOne(userId: number, friendId: number) {
    const key = `friends:user:${userId}:friend:${friendId}`;
    return this.get<Friend>(key);
  }

  async createOne(friendship: Friend) {
    const { userId, friendId } = friendship;
    const ex = CACHE_EX.DAYS(7);

    await Promise.all([
      this.create(`friends:user:${userId}:friend:${friendId}`, friendship, ex),
      this.create(`friends:user:${friendId}:friend:${userId}`, friendship, ex),
    ]);
  }

  async createMany(params: FriendsParams & { data: unknown }) {
    const { userId, page, limit, data } = params;
    const key = `friends:user:${userId}:data:page=${page}:limit=${limit}`;
    const ex = CACHE_EX.DAYS(7);
    await this.create(key, data, ex);
  }

  async getMany(params: FriendsParams) {
    const { userId, page, limit } = params;
    const key = `friends:user:${userId}:data:page=${page}:limit=${limit}`;
    return this.get<User[]>(key);
  }

  async deleteMany(userId: number, friendId: number) {
    await Promise.all([
      this.delete(`friends:user:${userId}`, 'nested'),
      this.delete(`friends:user:${friendId}`, 'nested'),
    ]);
  }
}

class FriendsRequestCache extends CacheService {
  async createMany(
    params: FriendsParams & { status: RequestStatus; data: User[] }
  ) {
    const { userId, page, limit, status, data } = params;
    const key = `friends:user:${userId}:requests:${status}:page=${page}:limit=${limit}`;
    await this.create(key, data, CACHE_EX.DAYS(7));
  }

  async getMany(params: FriendsParams & { status: RequestStatus }) {
    const { userId, page, limit, status } = params;
    const key = `friends:user:${userId}:requests:${status}:page=${page}:limit=${limit}`;
    return this.get<User[]>(key);
  }

  async deleteOne(userId: number) {
    const key = `friends:user:${userId}:requests`;
    await this.delete(key);
  }
}

class FriendsCountCache extends CacheService {
  async createOne(userId: number, value: number) {
    const key = `friends:user:${userId}:count`;
    await this.create(key, value, CACHE_EX.DAYS(3));
  }

  async getOne(userId: number) {
    const key = `friends:user:${userId}:count`;
    return this.get<number>(key);
  }

  async deleteOne(userId: number) {
    const key = `friends:user:${userId}:count`;
    await this.delete(key);
  }
}

export const friendsCache = new FriendsCache();
export const friendsCountCache = new FriendsCountCache();
export const friendsRequestCache = new FriendsRequestCache();
