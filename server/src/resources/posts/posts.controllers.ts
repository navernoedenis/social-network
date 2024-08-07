import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { commentsService } from '@/resources/comments';
import { likesService } from '@/resources/likes';

import { httpStatus } from '@/utils/constants';
import { Forbidden, paginateQuery } from '@/utils/helpers';

import { postsService } from './posts.service';
import {
  type CreateCommentDto,
  type CreateLikeDto,
  type CreatePostDto,
  type PostComment,
  type UpdateCommentDto,
} from './posts.types';

// Posts

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as CreatePostDto;

  try {
    const post = await postsService.createOne(me.id, dto);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: post,
      message: 'Post has been created ✉️',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const postId = parseInt(req.params.id);

  try {
    const post = await postsService.getOne(postId, me.id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: post,
      message: 'Here is your post 🌽',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 5,
  });

  try {
    const posts = await postsService.getMany({
      userId: me.id,
      page,
      limit,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: posts,
      message: 'Here is your posts 🌽🌽',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const togglePostLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as CreateLikeDto;
  const postId = parseInt(req.params.id);

  try {
    const postLike = await postsService.getLike(postId, me.id);

    let isLiked: boolean | null = dto.value === 1;
    let message = `The post has been ${isLiked ? 'liked' : 'disliked'} 🧢`;

    if (postLike) {
      if (postLike.like.value === dto.value) {
        await postsService.removeLike(postLike.likeId);
        isLiked = null;
        message = 'Your post like has been removed ⚡';
      } else {
        await likesService.updateOne(postLike.likeId, dto.value);
      }
    } else {
      const like = await likesService.createOne(dto.value);
      await postsService.createLike({
        likeId: like.id,
        postId,
        userId: me.id,
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: isLiked,
      message,
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

// Comments

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as CreateCommentDto;
  const postId = parseInt(req.params.id);

  try {
    const comment = await commentsService.createOne({
      message: dto.message,
      parentId: dto.parentId,
      userId: me.id,
    });

    if (!dto.parentId) {
      await postsService.createComment(postId, comment.id);
    }
    const newComment: PostComment = {
      ...comment,
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      comments: [],
    };

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: newComment,
      message: 'You have commented the post 🥣',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = parseInt(req.params.cid);
  const dto = req.body as UpdateCommentDto;

  try {
    await commentsService.updateOne(commentId, dto.message);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: true,
      message: 'Your comment has been updated 📎',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const commentId = parseInt(req.params.cid);

  try {
    const comment = await commentsService.getOne(commentId);
    const isAuthor = comment!.userId === me.id;
    const isAdminOrRoot = me.role === 'admin' || me.role === 'root';

    if (!(isAuthor || isAdminOrRoot)) {
      throw new Forbidden('You are not an author of this comment 👀');
    }

    await commentsService.deleteOne(commentId);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: true,
      message: 'Your comment has been removed 🚸',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const toggleCommentLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as CreateLikeDto;
  const commentId = parseInt(req.params.cid);

  try {
    const commentLike = await postsService.getCommentLike(commentId, me.id);

    let isLiked: boolean | null = dto.value === 1;
    let message = `The comment has been ${isLiked ? 'liked' : 'disliked'} 🍀`;

    if (commentLike) {
      if (commentLike.like.value === dto.value) {
        await postsService.removeCommentLike(commentLike.likeId);
        isLiked = null;
        message = 'Your comment like has been removed 🍈🍉';
      } else {
        await likesService.updateOne(commentLike.likeId, dto.value);
      }
    } else {
      const like = await likesService.createOne(dto.value);
      await postsService.createCommentLike({
        likeId: like.id,
        commentId,
        userId: me.id,
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: isLiked,
      message,
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
