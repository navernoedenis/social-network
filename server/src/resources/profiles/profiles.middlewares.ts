import { type NextFunction, type Request, type Response } from '@/types/main';
import { usersService } from '@/resources/users';
import { BadRequest } from '@/utils/helpers';
import { type UpdateDataDto } from './profiles.types';

export const isUsernameTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateDataDto = req.body as UpdateDataDto;
  const user = req.user!;

  try {
    if (!updateDataDto.username) {
      return next();
    }

    const result = await usersService.findByUsername(updateDataDto.username);
    if (!result || result.email === user.email) {
      return next();
    }

    throw new BadRequest('Username is already taken. Create another one 🥝');
  } catch (error) {
    next(error);
  }
};
