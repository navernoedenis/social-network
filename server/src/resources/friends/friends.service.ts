import { and, count, eq, or, SQL } from 'drizzle-orm';

import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { buildFriendQuery, getFriendsData } from './friends.helper';
import { type FriendsParams, type RequestStatus } from './friends.types';
import {
  friendsCache,
  friendsRequestCache,
  friendsCountCache,
} from './friends.cache';

class FriendsService {
  async getOne(userId: number, friendId: number) {
    const cacheData = await friendsCache.getOne(userId, friendId);
    if (cacheData) return cacheData;

    const friend = await db.query.friends.findFirst({
      where: buildFriendQuery(userId, friendId),
    });

    if (!friend) return null;

    await friendsCache.createOne(friend);
    return friend;
  }

  async getMany(config: { userId: number; page: number; limit: number }) {
    const cacheData = await friendsCache.getMany(config);
    if (cacheData) return cacheData;

    const sql = and(
      eq(entities.friends.status, 'approved'),
      or(
        eq(entities.friends.userId, config.userId),
        eq(entities.friends.friendId, config.userId)
      )
    );

    const friends = await getFriendsData({ ...config, sql });
    await friendsCache.createMany({
      ...config,
      data: friends,
    });

    return friends;
  }

  async deleteOne(userId: number, friendId: number) {
    const [removedFriend] = await db
      .delete(entities.friends)
      .where(buildFriendQuery(userId, friendId))
      .returning();

    await friendsCache.deleteMany(userId, friendId);
    return removedFriend;
  }
}

class FriendsRequestService {
  async createOne(userId: number, friendId: number) {
    const [friendRequest] = await db
      .insert(entities.friends)
      .values({
        status: 'pending',
        userId,
        friendId,
      })
      .returning();

    await Promise.all([
      friendsRequestCache.deleteOne(userId),
      friendsRequestCache.deleteOne(friendId),
    ]);

    return friendRequest;
  }

  async approveOne(userId: number, friendId: number) {
    const [friend] = await db
      .update(entities.friends)
      .set({ status: 'approved' })
      .where(buildFriendQuery(userId, friendId))
      .returning();

    await Promise.all([
      friendsRequestCache.deleteOne(userId),
      friendsRequestCache.deleteOne(friendId),
    ]);

    return friend;
  }

  async getMany(params: FriendsParams & { status: RequestStatus }) {
    const cacheData = await friendsRequestCache.getMany(params);
    if (cacheData) return cacheData;

    const requestSQL: SQL[] = [eq(entities.friends.status, 'pending')];

    if (params.status === 'incoming') {
      requestSQL.push(eq(entities.friends.friendId, params.userId));
    } else {
      requestSQL.push(eq(entities.friends.userId, params.userId));
    }

    const friends = await getFriendsData({
      ...params,
      sql: and(...requestSQL),
    });

    await friendsRequestCache.createMany({
      ...params,
      data: friends,
    });

    return friends;
  }
}

class FriendsCountService {
  async getCount(userId: number) {
    const cacheData = await friendsCountCache.getOne(userId);
    if (typeof cacheData === 'number') return cacheData;

    const [result] = await db
      .select({ count: count() })
      .from(entities.friends)
      .where(
        and(
          eq(entities.friends.status, 'approved'),
          or(
            eq(entities.friends.userId, userId),
            eq(entities.friends.friendId, userId)
          )
        )
      );

    await friendsCountCache.createOne(userId, result.count);
    return result.count;
  }
}

export const friendsCountService = new FriendsCountService();
export const friendsRequestService = new FriendsRequestService();
export const friendsService = new FriendsService();
