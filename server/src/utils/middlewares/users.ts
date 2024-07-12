import { type NextFunction, type Request, type Response } from '@/types/main';
import { BadRequest, Forbidden, NotFound } from '@/utils/helpers';
import { usersService } from '@/resources/users/users.service';

export const checkUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const userId = parseInt(req.params.id);

  try {
    if (isNaN(userId)) {
      throw new BadRequest('Invalid user id ⛔');
    }

    if (userId === user.id) {
      throw new Forbidden('You can not follow on yourself 🚫');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await usersService.findById(userId);
    if (!user) {
      throw new NotFound('User does not exist 🔍');
    }

    next();
  } catch (error) {
    next(error);
  }
};
