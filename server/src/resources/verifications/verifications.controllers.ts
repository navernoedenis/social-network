import {
  type Request,
  type Response,
  type NextFunction,
  type HttpResponse,
} from '@/types/main';

import { httpStatus } from '@/utils/constants';
import { BadRequest, createToken } from '@/utils/helpers';

import { profilesService } from '@/resources/profiles';
import { verificationsService } from './verifications.service';

export const newEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;

  try {
    await verificationsService.createEmailVerification({
      userId: user.id,
      payload: createToken(),
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'A new verify link has been created and send on your email! ✅',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token = '' } = req.params;

  try {
    const { error, data: verification } =
      await verificationsService.checkEmailByToken(token);

    if (!verification) throw new BadRequest(error);

    await profilesService.switchIsEmailVerified(verification.userId, true);
    await verificationsService.deleteEmailVerification(verification.id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'Your email address has been verified! 👍',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
