import { and, eq, desc, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { type CommentLike, type PostLike } from '@/db/files/models';
import * as entities from '@/db/files/entities';

import { calcLikes } from './posts.helpers';
import { type CreatePostDto, type Post, type PostComment } from './posts.types';

// TODO:
// 1. rewrite everything to make it clearer
// 2. rewrite on pure sql to reduce code and remove helpers

class PostsService {
  async createOne(userId: number, dto: CreatePostDto) {
    let id!: number;

    await db.transaction(async (ctx) => {
      const { body, files } = dto;

      const [post] = await ctx
        .insert(entities.posts)
        .values({ userId, body })
        .returning();

      for (const file of files) {
        await db.insert(entities.postsFiles).values({
          fileId: file.id,
          postId: post.id,
        });
      }

      id = post.id;
    });

    const newPost = await this.getOne(id, userId)!;
    return newPost!;
  }

  async getOne(id: number, userId: number) {
    // const post = await db.execute(sql`
    //     WITH
    //       p_files AS (
    //         SELECT * FROM posts_files pf
    //         JOIN files f ON f.id = pf.file_id
    //       ),
    //       p_likes AS (
    //         SELECT * FROM posts_likes pl
    //         JOIN likes l ON l.id = pl.like_id
    //       )
    //     SELECT
    //       p.*,
    //       ROW_TO_JSON(u) AS user,
    //       ARRAY(
    //         SELECT ROW_TO_JSON(pf) FROM p_files pf
    //         WHERE pf.post_id = p.id
    //       ) AS files,
    //       CAST((
    //         SELECT COUNT(*) FROM p_likes pl
    //         WHERE
    //           pl.value = 1 AND
    //           pl.post_id = p.id
    //       ) AS INTEGER) AS likes,
    //       CAST((
    //         SELECT COUNT(*) FROM p_likes pl
    //         WHERE
    //           pl.value = -1 AND
    //           pl.post_id = p.id
    //       ) AS INTEGER) AS dislikes,
    //       EXISTS(
    //         SELECT * FROM p_likes pl
    //         WHERE
    //           pl.post_id = p.id AND
    //           pl.user_id = ${userId} AND
    //           pl.value = 1
    //       ) AS is_liked,
    //       EXISTS(
    //         SELECT * FROM p_likes pl
    //         WHERE
    //           pl.post_id = p.id AND
    //           pl.user_id = ${userId} AND
    //           pl.value = -1
    //       ) AS is_disliked
    //     FROM posts p
    //     JOIN users u ON u.id = p.user_id
    //     WHERE p.id = ${id}
    //     GROUP BY p.id, u.id
    // `);
    // return post.rows[0] ?? null;
    //
    // const postComments = await db.execute(sql`
    //     WITH RECURSIVE my_comments AS (
    //       SELECT
    //         c.*,
    //         ROW_TO_JSON(u) AS user,
    //         CAST((
    //           SELECT COUNT(*) FROM comments_likes cl
    //           JOIN likes l ON l.id = cl.like_id
    //           WHERE
    //             cl.comment_id = c.id AND
    //             l.value = 1
    //         ) AS INTEGER) AS likes,
    //         CAST((
    //           SELECT COUNT(*) FROM comments_likes cl
    //           JOIN likes l ON l.id = cl.like_id
    //           WHERE
    //             cl.comment_id = c.id AND
    //             l.value = -1
    //         ) AS INTEGER) AS dislikes
    //       FROM posts_comments pc
    //       JOIN comments c ON c.id = pc.comment_id
    //       JOIN users u ON u.id = c.user_id
    //       WHERE pc.post_id = ${id}
    //       UNION ALL
    //       SELECT
    //         nc.*,
    //         ROW_TO_JSON(u) AS user,
    //         CAST((
    //           SELECT COUNT(*) FROM comments_likes cl
    //           JOIN likes l ON l.id = cl.like_id
    //           WHERE
    //             cl.comment_id = nc.id AND
    //             l.value = 1
    //         ) AS INTEGER) AS likes,
    //         CAST((
    //           SELECT COUNT(*) FROM comments_likes cl
    //           JOIN likes l ON l.id = cl.like_id
    //           WHERE
    //             cl.comment_id = nc.id AND
    //             l.value = -1
    //         ) AS INTEGER) AS dislikes
    //       FROM comments nc
    //       JOIN my_comments mc ON mc.id = nc.parent_id
    //       JOIN users u ON u.id = nc.user_id
    //     )
    //     SELECT * FROM my_comments
    // `);
    // return postComments.rows ?? null;

    const post = await db.query.posts.findFirst({
      where: eq(entities.posts.id, id),
      with: {
        user: true,
        files: true,
        comments: true,
      },
    });

    if (!post) return null;

    const data = await this.getPostData({
      comments: post.comments,
      files: post.files,
      userId,
      postId: post.id,
    });

    return { ...post, ...data };
  }

  async getMany(config: { page: number; limit: number; userId: number }) {
    // Todo: REWRITE ON SQL
    const { page, limit, userId } = config;

    const array = await db.query.posts.findMany({
      limit,
      offset: limit * page - limit,
      with: {
        user: true,
        files: true,
        comments: true,
      },
      orderBy: [desc(entities.posts.createdAt)],
    });

    const posts: Post[] = [];

    for (let index = 0; index < array.length; index++) {
      const post = array[index];
      const postData = await this.getPostData({
        comments: post.comments,
        files: post.files,
        userId,
        postId: post.id,
      });

      posts.push({ ...post, ...postData });
    }

    return posts;
  }

  async deteleOne(id: number) {
    const [removedPost] = await db
      .delete(entities.posts)
      .where(eq(entities.posts.id, id))
      .returning();

    return removedPost;
  }

  // COMMENTS

  async createComment(postId: number, commentId: number) {
    await db.insert(entities.postsComments).values({
      postId,
      commentId,
    });

    const comment = await db.query.comments.findFirst({
      where: eq(entities.comments.id, commentId),
      with: {
        user: true,
      },
    });

    return comment!;
  }

  async removeComment(id: number) {
    const [removedComment] = await db
      .delete(entities.postsComments)
      .where(eq(entities.postsComments.commentId, id))
      .returning();

    return removedComment;
  }

  // LIKES

  async createLike(data: PostLike) {
    const likes = await db.insert(entities.postsLikes).values(data).returning();
    return likes[0];
  }

  async getLike(postId: number, userId: number) {
    const myLike = and(
      eq(entities.postsLikes.postId, postId),
      eq(entities.postsLikes.userId, userId)
    );

    return db.query.postsLikes.findFirst({
      where: myLike,
      with: {
        like: true,
      },
    });
  }

  async removeLike(id: number) {
    const likes = await db
      .delete(entities.postsLikes)
      .where(eq(entities.postsLikes.likeId, id))
      .returning();

    return likes.length ? likes[0] : null;
  }

  // COMMENT LIKES

  async createCommentLike(data: CommentLike) {
    const likes = await db
      .insert(entities.commentsLikes)
      .values(data)
      .returning();

    return likes[0];
  }

  async getCommentLike(commentId: number, userId: number) {
    const myLike = and(
      eq(entities.commentsLikes.commentId, commentId),
      eq(entities.commentsLikes.userId, userId)
    );

    const like = await db.query.commentsLikes.findFirst({
      where: myLike,
      with: {
        like: true,
      },
    });

    return like ?? null;
  }

  async removeCommentLike(likeId: number) {
    const likes = await db
      .delete(entities.commentsLikes)
      .where(eq(entities.commentsLikes.likeId, likeId))
      .returning();

    return likes.length ? likes[0] : null;
  }

  // Todo: REMOVE HELPERS AFTER WRITING SQL
  // Todo: REMOVE HELPERS AFTER WRITING SQL
  // Todo: REMOVE HELPERS AFTER WRITING SQL
  // Todo: REMOVE HELPERS AFTER WRITING SQL
  // Todo: REMOVE HELPERS AFTER WRITING SQL

  private async getPostData(data: {
    comments: { commentId: number }[];
    files: { fileId: number }[];
    postId: number;
    userId: number;
  }) {
    const { postId, userId } = data;

    const commentIds = data.comments.map((comment) => comment.commentId);
    const fileIds = data.files.map((file) => file.fileId);

    const [comments, files, likes] = await Promise.all([
      this.getComments(commentIds, userId),
      this.getFiles(fileIds),
      this.getLikes(postId, userId),
    ]);

    return {
      ...likes,
      comments,
      files,
    };
  }

  private async getComments(ids: number[], userId: number) {
    const comments: PostComment[] = [];

    for (const id of ids) {
      comments.push(await this.getCommentsRecursive(id, userId));
    }

    return comments;
  }

  private async getCommentLikes(commentId: number, userId: number) {
    const commentLikes = await db.query.commentsLikes.findMany({
      where: eq(entities.commentsLikes.commentId, commentId),
      with: {
        like: true,
      },
    });

    return calcLikes(commentLikes, userId);
  }

  private async getCommentsRecursive(id: number, userId: number) {
    const comment = await db.query.comments.findFirst({
      where: eq(entities.comments.id, id),
      with: {
        user: true,
      },
    });

    const commentsQuery = db.query.comments.findMany({
      where: eq(entities.comments.parentId, comment!.id),
      with: {
        user: true,
      },
    });

    const [likes, comments] = await Promise.all([
      this.getCommentLikes(comment!.id, userId),
      commentsQuery,
    ]);

    const nestedComments: PostComment[] = [];

    if (comments.length) {
      const promises = comments.map((comment) =>
        this.getCommentsRecursive(comment.id, userId)
      );

      const response = await Promise.all(promises);
      nestedComments.push(...response);
    }

    return { ...comment!, ...likes, comments: nestedComments };
  }

  private async getFiles(ids: number[]) {
    if (!ids.length) return [];

    return db.query.files.findMany({
      where: inArray(entities.files.id, ids),
    });
  }

  private async getLikes(postId: number, userId: number) {
    const postLikes = await db.query.postsLikes.findMany({
      where: eq(entities.postsLikes.postId, postId),
      with: {
        like: true,
      },
    });

    return calcLikes(postLikes, userId);
  }
}

export const postsService = new PostsService();
