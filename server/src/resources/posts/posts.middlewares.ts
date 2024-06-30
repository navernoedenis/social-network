import { type Request, type Response, type NextFunction } from '@/types/main';
import { NotFound, Forbidden } from '@/utils/helpers';

import { commentsService } from '@/resources/comments';

import { postsService } from './posts.service';
import { type CreateCommentDto } from './posts.types';

export const hasPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = parseInt(req.params.id);
  const user = req.user!;

  try {
    const post = await postsService.getOne(postId, user.id);
    if (!post) {
      throw new NotFound("Post doesn't exist");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const hasComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = parseInt(req.params.cid);

  try {
    const comment = await commentsService.getOne(commentId);
    if (!comment) {
      throw new NotFound("Comment doesn't exist");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkCommentParent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.body as CreateCommentDto;

  try {
    if (!dto.parentId) return next();

    const parent = await commentsService.getOne(dto.parentId);
    if (!parent) {
      throw new NotFound("Parent comment doesn't exist");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkCommentUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = parseInt(req.params.cid);
  const user = req.user!;

  try {
    const comment = await commentsService.getOne(commentId);
    if (user.id !== comment!.userId) {
      throw new Forbidden('You are not an author of this comment');
    }

    next();
  } catch (error) {
    next(error);
  }
};
