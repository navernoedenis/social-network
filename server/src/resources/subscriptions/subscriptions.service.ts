import { and, count, eq } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

class SubscriptionsService {
  async getOne(myId: number, friendId: number) {
    const subscription = await db.query.subscriptions.findFirst({
      where: and(
        eq(entities.subscriptions.subscriberId, myId),
        eq(entities.subscriptions.subscribedToId, friendId)
      ),
    });

    return subscription ?? null;
  }

  async createOne(myId: number, friendId: number) {
    const [subscription] = await db
      .insert(entities.subscriptions)
      .values({
        subscriberId: myId,
        subscribedToId: friendId,
      })
      .returning();

    return subscription;
  }

  async deleteOne(myId: number, friendId: number) {
    const [removedSubscription] = await db
      .delete(entities.subscriptions)
      .where(
        and(
          eq(entities.subscriptions.subscriberId, myId),
          eq(entities.subscriptions.subscribedToId, friendId)
        )
      )
      .returning();

    return removedSubscription;
  }

  async getSubscriptionsCount(userId: number) {
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

    return {
      subscribed: subscribed.count,
      subscribers: subscribers.count,
    };
  }
}

export const subscriptionsService = new SubscriptionsService();
