import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { authCookie, httpStatus } from '@/utils/constants';
import { Forbidden } from '@/utils/helpers';
import { usersService } from './users.service';

export const deleteMyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;

  try {
    const me = await usersService.deleteOne(user.id);
    if (!me) {
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
