import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { authCookie, httpStatus } from '@/utils/constants';
import { Forbidden } from '@/utils/helpers';
import { usersService } from './users.service';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search = '' } = req.query;

  try {
    const users = await usersService.getMany(search as string, {
      withProfile: true,
    });

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
    const userData = await usersService.deleteOne(me.id);
    if (!userData) {
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
