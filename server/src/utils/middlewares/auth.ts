import {
  type NextFunction,
  type Request,
  type Response,
  type Role,
} from '@/types/main';

import { Forbidden, Unauthorized } from '@/utils/helpers';
import { verifyJwtToken } from '@/utils/lib';

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [bearer, token] = (req.headers.authorization ?? '').split(' ');
    if (bearer !== 'Bearer' || !token) {
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

export const hasRole = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) throw new Forbidden('Not permitted');

      const hasPermission = allowedRoles.includes(user.role);
      if (!hasPermission) {
        throw new Forbidden("You don't have permission");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
