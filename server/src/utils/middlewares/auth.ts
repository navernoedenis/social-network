import { type NextFunction, type Request, type Response } from '@/types/main';
import { Unauthorized, verifyJwtToken } from '@/utils/helpers';

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
