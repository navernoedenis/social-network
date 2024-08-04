import { eq, desc, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { type NewNotification } from '@/db/files/models';
import * as entities from '@/db/files/entities';

import { notificationsCache } from './notifications.cache';
import {
  createBirthdayMessage,
  createFriendRequestMessage,
} from './notifications.helpers';

class NotificationsService {
  async createOne(data: NewNotification) {
    const [notification] = await db
      .insert(entities.notifications)
      .values(data)
      .returning();

    await notificationsCache.createOne(notification);
    return notification;
  }

  async getOne(id: number) {
    const cacheData = await notificationsCache.getOne(id);
    if (cacheData) return cacheData;

    const notification = await db.query.notifications.findFirst({
      where: eq(entities.notifications.id, id),
    });

    if (notification) {
      await notificationsCache.createOne(notification);
    }

    return notification;
  }

  async getMany(userId: number) {
    const cacheData = await notificationsCache.getMany(userId);
    if (cacheData) return cacheData;

    const notifications = await db.query.notifications.findMany({
      where: eq(entities.notifications.recepientId, userId),
      orderBy: desc(entities.notifications.createdAt),
    });

    return notifications;
  }

  async deleteOne(id: number) {
    await db
      .delete(entities.notifications)
      .where(eq(entities.notifications.id, id));
  }

  async deleteMany(ids: number[]) {
    await db
      .delete(entities.notifications)
      .where(inArray(entities.notifications.id, ids));
  }

  async createBirthday(data: {
    date: Date;
    recepientId: number;
    birthPersonFirstname: string;
    birthPersonLastname: string;
  }) {
    return this.createOne({
      type: 'birthday',
      message: createBirthdayMessage(data),
      recepientId: data.recepientId,
      senderId: null,
    });
  }

  async createFriendRequest(data: {
    senderId: number;
    senderFirstname: string;
    senderLastname: string;
    recepientId: number;
  }) {
    return this.createOne({
      type: 'friend-request',
      recepientId: data.recepientId,
      senderId: data.senderId,
      message: createFriendRequestMessage(data),
    });
  }
}

export const notificationsService = new NotificationsService();
