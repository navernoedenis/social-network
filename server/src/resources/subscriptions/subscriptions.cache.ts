import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type Subscription } from '@/db/files/models';
import { type SubscriptionCount } from './subscriptions.types';

class SubscriptionsCache extends CacheService {
  async createOne(subscription: Subscription) {
    const { subscriberId, subscribedToId } = subscription;
    const key = `subscriptions:subscriber${subscriberId}:subscribed:${subscribedToId}`;
    const ex = CACHE_EX.DAYS(30);
    await this.create(key, subscription, ex);
  }

  async getOne(subscription: Subscription) {
    const { subscriberId, subscribedToId } = subscription;
    const key = `subscriptions:subscriber${subscriberId}:subscribed:${subscribedToId}`;
    return this.get<Subscription>(key);
  }

  async deleteOne(subscription: Subscription) {
    const { subscriberId, subscribedToId } = subscription;
    const key = `subscriptions:subscriber${subscriberId}:subscribed:${subscribedToId}`;
    await this.delete(key);
  }

  async createCount(userId: number, data: SubscriptionCount) {
    const key = `subscriptions:user:${userId}:count`;
    const ex = CACHE_EX.DAYS(5);
    await this.create(key, data, ex);
  }

  async getCount(userId: number) {
    const key = `subscriptions:user:${userId}:count`;
    return this.get<SubscriptionCount>(key);
  }
}

export const subscriptionsCache = new SubscriptionsCache();
