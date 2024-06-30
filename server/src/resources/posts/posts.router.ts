import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import {
  createComment,
  createPost,
  getPost,
  getPosts,
  removeComment,
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

const validators = {
  createComment: [
    validateBody(createCommentSchema),
    hasPost,
    checkCommentParent,
  ],
  createPost: [validateBody(createPostSchema)],
  getPost: [hasPost],
  removeComment: [hasComment],
  toggleCommentLike: [validateBody(createLikeSchema), hasComment],
  togglePostLike: [validateBody(createLikeSchema), hasPost],
  updateComment: [
    validateBody(updateCommentSchema),
    hasComment,
    checkCommentUpdate,
  ],
};

postsRouter
  .get('/', getPosts)
  .post('/', validators.createPost, createPost)

  .get('/:id', validators.getPost, getPost)
  .patch('/:id/like', validators.togglePostLike, togglePostLike)

  .post('/:id/comments', validators.createComment, createComment)
  .put('/:id/comments/:cid', validators.updateComment, updateComment)
  .delete('/:id/comments/:cid', validators.removeComment, removeComment)
  .patch(
    '/:id/comments/:cid/like',
    validators.toggleCommentLike,
    toggleCommentLike
  );
