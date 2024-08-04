import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import * as entities from '@/db/files/entities';
import { type Conversation } from '@/db/files/models';

import { conversationsCache } from './conversations.cache';

class ConversationsService {
  async createOne(userId: number, friendId: number) {
    await db.insert(entities.conversations).values({
      authorId: userId,
      userId: friendId,
    });

    await Promise.all([
      conversationsCache.deleteMany(userId),
      conversationsCache.deleteMany(friendId),
    ]);

    return this.getOne(userId, friendId);
  }

  async getOne(userId: number, friendId: number) {
    const cacheData = await conversationsCache.getOne(userId, friendId);
    if (cacheData) return cacheData;

    const data = await db.execute(sql`
      SELECT 
        c.id,
        c.created_at,
        CASE
          WHEN u.id = ${userId}
          THEN ROW_TO_JSON(a)
          ELSE ROW_TO_JSON(u)
        END AS user,
      (
        SELECT ROW_TO_JSON(x) 
        FROM (
          SELECT m.id, m.message, m.created_at
          FROM messages m 
          JOIN conversations_messages cm ON cm.conversation_id = c.id
          WHERE cm.message_id = m.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS x  
      ) AS last_message

      FROM conversations c
      JOIN users u ON u.id = c.author_id
      JOIN users a ON a.id = c.user_id
      WHERE 
        c.author_id = ${userId} AND c.user_id = ${friendId} OR
        c.author_id = ${friendId} AND c.user_id = ${userId}

      ORDER BY c.updated_at DESC
      LIMIT 1
    `);

    const conversation = data.rows[0] as Conversation | null;
    if (!conversation) return null;

    await conversationsCache.createOne({
      conversation,
      userId,
      friendId,
    });

    return conversation;
  }

  async getMany(userId: number) {
    const cacheData = await conversationsCache.getMany(userId);
    if (cacheData) return cacheData;

    const data = await db.execute(sql`
      SELECT 
        c.id,
        c.created_at,
        CASE
          WHEN u.id = ${userId}
          THEN ROW_TO_JSON(a)
          ELSE ROW_TO_JSON(u)
        END AS user,
      (
        SELECT ROW_TO_JSON(x) 
        FROM (
          SELECT m.id, m.message, m.created_at
          FROM messages m 
          JOIN conversations_messages cm ON cm.conversation_id = c.id
          WHERE cm.message_id = m.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS x  
      ) AS last_message

      FROM conversations c
      JOIN users a ON a.id = c.author_id
      JOIN users u ON u.id = c.user_id
      WHERE 
        c.author_id = ${userId} OR 
        c.user_id = ${userId}

      ORDER BY c.updated_at DESC
    `);

    await conversationsCache.createMany(userId, data.rows);

    return data.rows as Conversation[];
  }

  async deleteOne(id: number) {
    const [removed] = await db
      .delete(entities.conversations)
      .where(eq(entities.conversations.id, id))
      .returning();

    await Promise.all([
      conversationsCache.deleteMany(removed.authorId),
      conversationsCache.deleteMany(removed.userId),
    ]);

    return removed;
  }
}

export const conversationsService = new ConversationsService();
