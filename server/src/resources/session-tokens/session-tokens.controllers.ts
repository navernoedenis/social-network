import {
  type HttpResponse,
  type Request,
  type Response,
  type NextFunction,
} from '@/types/main';

import { BadRequest, Forbidden, parseCookieToken } from '@/utils/helpers';
import { httpStatus } from '@/utils/constants';
import { sessionsTokensService } from './session-tokens.service';

export const getSessionTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;

  try {
    const tokens = await sessionsTokensService.getMany(me.id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: tokens,
      message: "You've received your refresh tokens",
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteSessionToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const token = req.params.token;

  try {
    const sessionToken = await sessionsTokensService.getByToken(token);
    if (!sessionToken) {
      throw new BadRequest("Token doesn't exists");
    }

    const isMyToken = sessionToken.userId === me.id;
    if (!isMyToken) {
      throw new Forbidden('You are trying to remove not your token');
    }

    await sessionsTokensService.deleteOne(token);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You token has been deleted!',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteSessionTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const cookieToken = parseCookieToken(req.cookies);
  const refreshToken = cookieToken.refreshToken!;

  try {
    await sessionsTokensService.deleteMany(me.id, refreshToken);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You tokens has been deleted!',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
