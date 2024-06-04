import {
  type AuthUser,
  type NextFunction,
  type Request,
  type Response,
  type Role,
} from '@/types/main';

import { Forbidden, Unauthorized } from '@/utils/helpers';
import { verifyJwtToken } from '@/utils/lib';

export const isAuthorized = async (
  req: Request & { user?: AuthUser },
  res: Response,
  next: NextFunction
) => {
  const [bearer, token] = (req.headers.authorization ?? '').split(' ');

  try {
    if (bearer !== 'Bearer' && !token) {
      throw new Unauthorized('No bearer token');
    }

    const user = verifyJwtToken(token, 'access');
    if (!user) {
      throw new Unauthorized('Invalid token');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const hasRole =
  (allowedRoles: Role[]) =>
  async (
    req: Request & { user: AuthUser },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const hasPermission = allowedRoles.includes(req.user.role);
      if (!hasPermission) {
        throw new Forbidden("You don't have permission");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
