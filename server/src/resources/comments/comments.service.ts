import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { type CommentLike, type NewComment } from '@/db/files/models';
import * as entities from '@/db/files/entities';

class CommentsService {
  async createOne(data: NewComment) {
    const [newComment] = await db
      .insert(entities.comments)
      .values(data)
      .returning({ id: entities.comments.id });

    const comment = await db.query.comments.findFirst({
      where: eq(entities.comments.id, newComment.id),
      with: {
        user: true,
      },
    });

    return comment!;
  }

  async updateOne(id: number, message: string) {
    await db
      .update(entities.comments)
      .set({ message })
      .where(eq(entities.comments.id, id));

    return this.getOne(id);
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
    const removedComment = await this.getOne(id);
    if (removedComment) {
      await db.delete(entities.comments).where(eq(entities.comments.id, id));
    }
    return removedComment;
  }

  async likeOne(data: CommentLike) {
    await db.insert(entities.commentsLikes).values(data);
  }
}

export const commentsService = new CommentsService();
