import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { type CommentLike, type PostLike } from '@/db/files/models';
import * as entities from '@/db/files/entities';

import { type CreatePostDto, type Post, type PostComment } from './posts.types';

class PostsService {
  async createPost(userId: number, dto: CreatePostDto) {
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

    const newPost = await this.getPost(id, userId)!;
    return newPost!;
  }

  async getPost(id: number, userId: number) {
    // Todo: REWRITE ON SQL
    const post = await db.query.posts.findFirst({
      where: eq(entities.posts.id, id),
      with: {
        user: true,
        files: true,
        comments: true,
      },
    });

    if (!post) return null;

    const commentIds = post.comments.map((comment) => comment.commentId);

    const [comments, files, likes] = await Promise.all([
      this.getComments(commentIds, userId),
      this.getFiles(post.files.map((file) => file.fileId)),
      this.getLikes(post.id, userId),
    ]);

    return {
      ...post,
      ...likes,
      files,
      comments,
    };
  }

  async getPosts(config: { page: number; limit: number; userId: number }) {
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
      // orderBy: [desc(entities.posts.createdAt)],
    });

    const posts: Post[] = [];

    for (let index = 0; index < array.length; index++) {
      const post = array[index];

      const commentIds = post.comments.map((comment) => comment.commentId);

      const [comments, files, likes] = await Promise.all([
        this.getComments(commentIds, userId),
        this.getFiles(post.files.map((file) => file.fileId)),
        this.getLikes(post.id, userId),
      ]);

      posts.push({
        ...post,
        ...likes,
        files,
        comments,
      });
    }

    return posts;
  }

  async removePost(id: number) {
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

    return this.calcLikes(commentLikes, userId);
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

    return this.calcLikes(postLikes, userId);
  }

  private calcLikes(
    data: { userId: number; like: { value: number } }[],
    userId: number
  ) {
    let likes = 0;
    let dislikes = 0;
    let isLiked = false;
    let isDisliked = false;

    for (const item of data) {
      const isLike = item.like.value === 1;
      const isDislike = item.like.value === -1;
      const isMyLike = item.userId === userId;

      if (isLike) {
        likes += 1;
        isMyLike && (isLiked = true);
      }

      if (isDislike) {
        dislikes += 1;
        isMyLike && (isDisliked = true);
      }
    }

    return {
      likes,
      dislikes,
      isLiked,
      isDisliked,
    };
  }
}

export const postsService = new PostsService();
