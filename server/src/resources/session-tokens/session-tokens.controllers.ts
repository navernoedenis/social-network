import {
  type HttpResponse,
  type Request,
  type Response,
  type NextFunction,
} from '@/types/main';

import { BadRequest, parseCookieToken } from '@/utils/helpers';
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

export const revokeSessionToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const tokenId = req.params.id;

  try {
    const revokedToken = await sessionsTokensService.revokeOne({
      tokenId,
      userId: me.id,
    });
    if (!revokedToken) {
      throw new BadRequest("Token doesn't exists");
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You token has been revoked!',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const revokeSessionTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const cookieToken = parseCookieToken(req.cookies);
  const refreshToken = cookieToken.refreshToken!;

  try {
    await sessionsTokensService.revokeMany(me.id, {
      exceptCurrentToken: refreshToken,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You tokens has been revoked!',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
