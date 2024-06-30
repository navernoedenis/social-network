import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { type NewNotification } from '@/db/files/models';

import * as entities from '@/db/files/entities';
import {
  createBirthdayMessage,
  createFriendRequestMessage,
} from './notifications.helpers';

class NotificationsService {
  async createOne(date: NewNotification) {
    const notifications = await db
      .insert(entities.notifications)
      .values(date)
      .returning();

    return notifications[0];
  }

  async getOne(id: number) {
    const notification = await db.query.notifications.findFirst({
      where: eq(entities.notifications.id, id),
    });

    return notification ?? null;
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
