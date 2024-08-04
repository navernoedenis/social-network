import { and, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { type SubscriptionCount } from './subscriptions.types';
import { subscriptionsCache } from './subscriptions.cache';

class SubscriptionsService {
  async getOne(userId: number, friendId: number) {
    const cacheData = await subscriptionsCache.getOne({
      subscriberId: userId,
      subscribedToId: friendId,
    });
    if (cacheData) return cacheData;

    const subscription = await db.query.subscriptions.findFirst({
      where: and(
        eq(entities.subscriptions.subscriberId, userId),
        eq(entities.subscriptions.subscribedToId, friendId)
      ),
    });

    if (subscription) {
      await subscriptionsCache.createOne(subscription);
    }

    return subscription;
  }

  async createOne(userId: number, friendId: number) {
    const [subscription] = await db
      .insert(entities.subscriptions)
      .values({
        subscriberId: userId,
        subscribedToId: friendId,
      })
      .returning();

    if (subscription) {
      await subscriptionsCache.createOne(subscription);
    }

    return subscription;
  }

  async deleteOne(userId: number, friendId: number) {
    const subscriptionSQL = and(
      eq(entities.subscriptions.subscriberId, userId),
      eq(entities.subscriptions.subscribedToId, friendId)
    );

    await Promise.all([
      db.delete(entities.subscriptions).where(subscriptionSQL),
      subscriptionsCache.deleteOne({
        subscriberId: userId,
        subscribedToId: friendId,
      }),
    ]);
  }

  async getSubscriptionsCount(userId: number) {
    const cacheData = await subscriptionsCache.getCount(userId);
    if (cacheData) return cacheData;

    const [[subscribed], [subscribers]] = await Promise.all([
      db
        .select({ count: count() })
        .from(entities.subscriptions)
        .where(eq(entities.subscriptions.subscriberId, userId)),
      db
        .select({ count: count() })
        .from(entities.subscriptions)
        .where(eq(entities.subscriptions.subscribedToId, userId)),
    ]);

    const countData: SubscriptionCount = {
      subscribed: subscribed.count,
      subscribers: subscribers.count,
    };

    await subscriptionsCache.createCount(userId, countData);
    return countData;
  }
}

export const subscriptionsService = new SubscriptionsService();
