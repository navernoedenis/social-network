import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type Notification } from '@/db/files/models';

class NotificationsCache extends CacheService {
  async createOne(notification: Notification) {
    const idKey = `notifications:id:${notification.id}`;
    const userKey = `notifications:user:${notification.recepientId}`;

    const updatedNotifications: Notification[] = [notification];
    const cacheData = await this.get<Notification[]>(userKey);

    if (cacheData) {
      updatedNotifications.push(...cacheData);
    }

    const ex = CACHE_EX.DAYS(7);
    await Promise.all([
      this.create(idKey, notification, ex),
      this.create(userKey, updatedNotifications, ex),
    ]);
  }

  async createMany(userId: number, notifications: Notification[]) {
    const key = `notifications:user:${userId}`;
    const ex = CACHE_EX.DAYS(5);

    const notificationsPromises = notifications.map((notification) =>
      this.create(`notifications:id:${notification.id}`, notification, ex)
    );

    await Promise.all([
      ...notificationsPromises,
      this.create(key, notifications, ex),
    ]);
  }

  async getOne(id: number) {
    const key = `notifications:id:${id}`;
    return this.get<Notification>(key);
  }

  async getMany(userId: number) {
    const key = `notifications:user:${userId}`;
    return this.get<Notification[]>(key);
  }

  async deleteOne(userId: number, notificationId: number) {
    const idKey = `notifications:id:${notificationId}`;
    const userKey = `notifications:user:${userId}`;

    const cacheData = await this.get<Notification[]>(userKey);
    if (!cacheData) return;

    const filteredData = cacheData.map((item) => item.id !== notificationId);

    await Promise.all([
      this.create(userKey, filteredData, CACHE_EX.DAYS(5)),
      this.delete(idKey),
    ]);
  }

  async deleteMany(userId: number) {
    const cacheData = await this.getMany(userId);
    const cacheKeys = cacheData
      ? cacheData.map((item) => `notifications:id:${item.id}`)
      : [];

    cacheKeys.push(`notifications:user:${userId}`);
    await Promise.all(cacheKeys.map((key) => this.delete(key)));
  }
}

export const notificationsCache = new NotificationsCache();
