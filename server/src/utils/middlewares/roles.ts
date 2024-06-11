import {
  type NextFunction,
  type Request,
  type Response,
  type Role,
} from '@/types/main';

import { Forbidden } from '@/utils/helpers';

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
