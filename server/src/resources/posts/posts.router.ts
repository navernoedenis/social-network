import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import {
  createComment,
  createPost,
  deleteComment,
  getPost,
  getPosts,
  toggleCommentLike,
  togglePostLike,
  updateComment,
} from './posts.controllers';

import {
  checkCommentParent,
  checkCommentUpdate,
  hasComment,
  hasPost,
} from './posts.middlewares';

import {
  createCommentSchema,
  createLikeSchema,
  createPostSchema,
  updateCommentSchema,
} from './posts.schemas';

export const postsRouter = Router();

postsRouter
  .get('/', getPosts)
  .post('/', validateBody(createPostSchema), createPost)

  .get('/:id', hasPost, getPost)
  .patch('/:id/like', validateBody(createLikeSchema), hasPost, togglePostLike)

  .post(
    '/:id/comments',
    validateBody(createCommentSchema),
    hasPost,
    checkCommentParent,
    createComment
  )
  .put(
    '/:id/comments/:cid',
    validateBody(updateCommentSchema),
    hasComment,
    checkCommentUpdate,
    updateComment
  )
  .delete('/:id/comments/:cid', hasComment, deleteComment)
  .patch(
    '/:id/comments/:cid/like',
    validateBody(createLikeSchema),
    hasComment,
    toggleCommentLike
  );
