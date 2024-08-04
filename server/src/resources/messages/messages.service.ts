import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { type NewMessage } from '@/db/files/models';
import * as entities from '@/db/files/entities';
import { type WithConfig } from './messages.types';

class MessagesService {
  async createOne(data: NewMessage) {
    const [message] = await db
      .insert(entities.messages)
      .values({
        authorId: data.authorId,
        body: data.body,
      })
      .returning();

    return message;
  }

  async getOne(id: number, config: WithConfig = {}) {
    return db.query.messages.findFirst({
      where: eq(entities.messages.id, id),
      with: {
        ...(config.withAuthor && { author: true }),
        ...(config.withFiles && { files: true }),
      },
    });
  }

  async getMany(ids: number[], config: WithConfig = {}) {
    return db.query.messages.findFirst({
      where: inArray(entities.messages.id, ids),
      with: {
        ...(config.withAuthor && { author: true }),
        ...(config.withFiles && { files: true }),
      },
    });
  }

  async updateOne(id: number, body: string) {
    const [updatedMessage] = await db
      .update(entities.messages)
      .set({ body })
      .where(eq(entities.messages.id, id))
      .returning();

    return updatedMessage;
  }

  async deleteOne(id: number) {
    const [removedMessage] = await db
      .delete(entities.messages)
      .where(eq(entities.messages.id, id))
      .returning();

    return removedMessage;
  }

  async deleteMany(ids: number[]) {
    const removedMessages = await db
      .delete(entities.messages)
      .where(inArray(entities.messages.id, ids))
      .returning();

    return removedMessages;
  }
}

export const messagesService = new MessagesService();
