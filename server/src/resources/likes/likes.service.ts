import { eq } from 'drizzle-orm';
import { db } from '@/db';

import * as entities from '@/db/files/entities';

class LikesService {
  async createOne(value: number) {
    const likes = await db.insert(entities.likes).values({ value }).returning();
    return likes[0];
  }

  async getOne(id: number) {
    const like = await db.query.likes.findFirst({
      where: eq(entities.likes.id, id),
    });
    return like ?? null;
  }

  async updateOne(id: number, value: number) {
    return db
      .update(entities.likes)
      .set({ value })
      .where(eq(entities.likes.id, id))
      .returning();
  }

  async deleteOne(id: number) {
    await db.delete(entities.likes).where(eq(entities.likes.id, id));
  }
}

export const likesService = new LikesService();
