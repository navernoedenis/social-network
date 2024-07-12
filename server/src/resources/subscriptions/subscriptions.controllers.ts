import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { httpStatus } from '@/utils/constants';
import { subscriptionsService } from './subscriptions.service';

export const toggleSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const friendId = parseInt(req.params.id);

  try {
    const subscription = await subscriptionsService.getOne(user.id, friendId);
    let message = '';

    if (subscription) {
      await subscriptionsService.deleteOne(user.id, friendId);
      message = 'You deleted your subscription 🏎️';
    } else {
      await subscriptionsService.createOne(user.id, friendId);
      message = 'You have subscribed to the user 🚛';
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: !subscription,
      message,
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionsCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.id);

  try {
    const data = await subscriptionsService.getSubscriptionsCount(userId);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data,
      message: 'Here are user subscriptions count 🧨',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
