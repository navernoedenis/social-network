import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { authCookie, httpStatus } from '@/utils/constants';
import { sessionsTokensService } from '@/resources/session-tokens/session-tokens.service';
import {
  getErrorMessage,
  parseCookieToken,
  Unauthorized,
  verifyJwtToken,
} from '@/utils/helpers';

export const checkCookieToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { hasToken, isExpired, refreshToken } = parseCookieToken(req.cookies);

  try {
    if (!hasToken) {
      throw new Unauthorized('No refresh token');
    }

    if (isExpired) {
      await sessionsTokensService.deleteOne(refreshToken);

      return res
        .status(httpStatus.UNAUTHORIZED)
        .clearCookie(authCookie.refreshToken)
        .json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          error:
            'Your refresh token is expired. ' +
            'Try to login and receive new pair of tokes',
        } as HttpResponse);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyCookieToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieToken = parseCookieToken(req.cookies);
  const refreshToken = cookieToken.refreshToken!;

  try {
    const user = verifyJwtToken(refreshToken, 'refresh');
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const sessionTokens = await sessionsTokensService.findMany(user.id);
    const isSessionTokenExists = sessionTokens.find(
      (sessionToken) => sessionToken.token === refreshToken
    );

    if (!isSessionTokenExists) {
      throw new Error('Your refresh token has been revoked');
    }

    next();
  } catch (error) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .clearCookie(authCookie.refreshToken)
      .json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        error: getErrorMessage(error),
      } as HttpResponse);
  }
};
