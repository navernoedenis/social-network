import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { httpStatus } from '@/utils/constants';
import { Forbidden, paginateQuery } from '@/utils/helpers';
import { friendsService } from './friends.service';

export const createFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    await friendsService.createOne(user.id, friendId);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You have created a friendship request 🫒',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const approveFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    const friendship = await friendsService.getOne(friendId, user.id);
    if (friendship!.userId === user.id) {
      throw new Forbidden("You can't approve your friend request 🤚");
    }

    await friendsService.approveOne(user.id, friendId);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You have approved a friend 🖐️',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getFriends = async (
  req: Request<unknown, unknown, unknown, { page: string; limit: string }>,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  const user = req.user!;

  try {
    const [count, friends] = await Promise.all([
      friendsService.friendsCount(user.id),
      friendsService.getMany({
        myId: user.id,
        page,
        limit,
      }),
    ]);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: { count, friends },
      message: 'Here are you friends 🛩️',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    await friendsService.deleteOne(user.id, friendId);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You removed a friend from your friends list 🎃',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (
  req: Request<unknown, unknown, unknown, { page: string; limit: string }>,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  const user = req.user!;

  try {
    const requests = await friendsService.getRequests({
      myId: user.id,
      page,
      limit,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: requests,
      message: 'Your friends requests 🗞️',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (
  req: Request<unknown, unknown, unknown, { page: string; limit: string }>,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  const user = req.user!;

  try {
    const myRequests = await friendsService.getMyRequests({
      myId: user.id,
      page,
      limit,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: myRequests,
      message: 'There are your requests 🍕',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
