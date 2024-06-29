import z from 'zod';
import {
  type Comment,
  type File,
  type Post as TPost,
  type User,
} from '@/db/files/models';

import {
  createCommentSchema,
  createLikeSchema,
  createPostSchema,
  updateCommentSchema,
} from './posts.schemas';

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type CreateLikeDto = z.infer<typeof createLikeSchema>;
export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

export interface Post extends TPost, Likes {
  comments: PostComment[];
  files: File[];
  user: User;
}

export interface PostComment extends Comment, Likes {
  comments: PostComment[];
  user: User;
}

export interface Likes {
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
}
