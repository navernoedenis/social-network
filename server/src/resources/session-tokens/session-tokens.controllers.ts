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
  const user = req.user!;

  try {
    const tokens = await sessionsTokensService.getMany(user.id);

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
  const tokenId = req.params.id;
  const user = req.user!;

  try {
    const revokedToken = await sessionsTokensService.revokeOne({
      tokenId,
      userId: user.id,
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
  const cookieToken = parseCookieToken(req.cookies);
  const refreshToken = cookieToken.refreshToken!;
  const user = req.user!;

  try {
    await sessionsTokensService.revokeMany(user.id, {
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
