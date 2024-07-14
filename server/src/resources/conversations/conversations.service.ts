import { and, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

class ConversationsService {
  async createOne(myId: number, userId: number) {
    const [conversation] = await db
      .insert(entities.conversations)
      .values({ authorId: myId, userId })
      .returning();

    return this.getOne(conversation.id, myId);
  }

  async getOne(id: number, myId: number) {
    return db.query.conversations.findFirst({
      where: and(
        eq(entities.conversations.id, id),
        or(
          eq(entities.conversations.authorId, myId),
          eq(entities.conversations.userId, myId)
        )
      ),
      with: {
        author: { with: { profile: true } },
        user: { with: { profile: true } },
        messages: { limit: 1, with: { message: true } },
      },
    });
  }

  async getMany(userId: number) {
    return db.query.conversations.findMany({
      where: or(
        eq(entities.conversations.authorId, userId),
        eq(entities.conversations.userId, userId)
      ),
      with: {
        author: { with: { profile: true } },
        user: { with: { profile: true } },
        messages: { limit: 1, with: { message: true } },
      },
    });
  }

  async findOne(config: { authorId: number; userId: number }) {
    const { authorId, userId } = config;

    return db.query.conversations.findFirst({
      where: or(
        and(
          eq(entities.conversations.authorId, authorId),
          eq(entities.conversations.userId, userId)
        ),
        and(
          eq(entities.conversations.authorId, userId),
          eq(entities.conversations.userId, authorId)
        )
      ),
    });
  }

  async deleteOne(id: number) {
    const [removedConversation] = await db
      .delete(entities.conversations)
      .where(eq(entities.conversations.id, id))
      .returning();

    return removedConversation;
  }
}

export const conversationsService = new ConversationsService();
