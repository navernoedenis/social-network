import { httpStatus } from '@/utils/constants';
import { BadRequest, createToken } from '@/utils/helpers';

import { profilesService } from '@/resources/profiles';
import { verificationsService } from './verifications.service';

import {
  type Request,
  type Response,
  type NextFunction,
  type HttpResponse,
} from '@/types/main';

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token = '' } = req.params;

  try {
    const { error, data: verification } =
      await verificationsService.checkEmailByToken(token);

    if (!verification) throw new BadRequest(error);

    await profilesService.verifyEmail(verification.userId);
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

export const newEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;

    const { error } = await verificationsService.createEmailVerification({
      userId: user.id,
      email: user.email,
      token: createToken(),
    });

    if (error) throw new BadRequest(error);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'New verify link has been created and send on your email! ✅',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
