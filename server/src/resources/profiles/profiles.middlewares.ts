import { type NextFunction, type Request, type Response } from '@/types/main';
import { usersService } from '@/resources/users';
import { BadRequest } from '@/utils/helpers';
import { type UpdateDataDto } from './profiles.types';

export const isUsernameTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;
  const dto = req.body as UpdateDataDto;

  try {
    if (!dto.username) {
      return next();
    }

    const result = await usersService.getByUsername(dto.username);
    if (!result || result.email === me.email) {
      return next();
    }

    throw new BadRequest('Username is already taken. Create another one 🥝');
  } catch (error) {
    next(error);
  }
};
