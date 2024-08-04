import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { httpStatus } from '@/utils/constants';
import { Forbidden, paginateQuery } from '@/utils/helpers';
import {
  friendsCountService,
  friendsRequestService,
  friendsService,
} from './friends.service';

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
    const friends = await friendsService.getMany({
      userId: me.id,
      page,
      limit,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: friends,
      message: 'Here are you friends 🛩️',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getFriendsCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;

  try {
    const friendsCount = await friendsCountService.getCount(me.id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: friendsCount,
      message: 'Your friends count 📐',
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

export const createFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    await friendsRequestService.createOne(me.id, friendId);

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

export const approveFriendRequest = async (
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

    await friendsRequestService.approveOne(me.id, friendId);

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

export const getIncomingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  try {
    const requests = await friendsRequestService.getMany({
      status: 'incoming',
      userId: me.id,
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

export const getOutgoingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const { page, limit } = paginateQuery(req.query, {
    defaultLimit: 10,
  });

  try {
    const myRequests = await friendsRequestService.getMany({
      status: 'outgoing',
      userId: me.id,
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
