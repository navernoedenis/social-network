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
  const me = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    await friendsService.createOne(me.id, friendId);

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
  const me = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    const friendship = await friendsService.getOne(me.id, friendId);
    if (friendship!.userId === me.id) {
      throw new Forbidden("You can't approve your friend request 🤚");
    }

    await friendsService.approveOne(me.id, friendId);

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  try {
    const [count, friends] = await Promise.all([
      friendsService.friendsCount(me.id),
      friendsService.getMany({
        myId: me.id,
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
  const me = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    await friendsService.deleteOne(me.id, friendId);

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  try {
    const requests = await friendsService.getRequests({
      myId: me.id,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  try {
    const myRequests = await friendsService.getMyRequests({
      myId: me.id,
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
