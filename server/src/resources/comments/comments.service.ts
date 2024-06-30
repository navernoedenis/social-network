import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type CommentLike, type NewComment } from '@/db/files/models';

import * as entities from '@/db/files/entities';

class CommentsService {
  async createOne(data: NewComment) {
    const [comment] = await db
      .insert(entities.comments)
      .values(data)
      .returning({ id: entities.comments.id });

    const newComment = await db.query.comments.findFirst({
      where: eq(entities.comments.id, comment.id),
      with: {
        user: true,
      },
    });

    return newComment!;
  }

  async updateOne(id: number, message: string) {
    const [comment] = await db
      .update(entities.comments)
      .set({ message })
      .where(eq(entities.comments.id, id))
      .returning();

    return comment;
  }

  async getOne(id: number) {
    return db.query.comments.findFirst({
      where: eq(entities.comments.id, id),
      with: {
        user: true,
      },
    });
  }

  async deleteOne(id: number) {
    const [removedComment] = await db
      .delete(entities.comments)
      .where(eq(entities.comments.id, id))
      .returning();

    return removedComment;
  }

  async likeOne(data: CommentLike) {
    await db.insert(entities.commentsLikes).values(data);
  }
}

export const commentsService = new CommentsService();
