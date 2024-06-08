import { profilesService } from '@/resources/profiles';
import { verificationsService } from './verifications.service';

import { type Request, type Response, type NextFunction } from '@/types/main';
import { BadRequest, Conflict } from '@/utils/helpers';

export const checkIsEmailVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;

  try {
    const profile = await profilesService.getProfile(user.id);
    if (profile?.isVerified) {
      throw new Conflict('Your email is already verified');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkIsEmailVerificationExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;

  try {
    const verification = await verificationsService.getEmailVerification({
      userId: user.id,
    });

    if (verification) {
      const message =
        "You can't create a new token, " +
        "because the current one hasn't expired yet";

      throw new BadRequest(message);
    }

    next();
  } catch (error) {
    next(error);
  }
};
