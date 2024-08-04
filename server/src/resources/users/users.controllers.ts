import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { authCookie, httpStatus } from '@/utils/constants';
import { Forbidden } from '@/utils/helpers';
import { usersService, usersSearchService } from './users.service';

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.query.search as string;

  try {
    const users = await usersSearchService.getMany(search ?? '');

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: users,
      message: 'Founded users 🦝',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;

  try {
    const user = await usersService.deleteOne(me.id);
    if (!user) {
      throw new Forbidden('You have already removed yourself 🤗');
    }

    res
      .status(httpStatus.OK)
      .clearCookie(authCookie.refreshToken)
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: null,
        message: 'Your account has been successfully deleted 🤗',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
