import {
  type Request,
  type Response,
  type NextFunction,
  type HttpResponse,
} from '@/types/main';

import { profilesService } from '@/resources/profiles';

import { BadRequest, createToken } from '@/utils/helpers';
import { createLink } from '@/utils/helpers';
import { emailService } from '@/utils/services';
import { httpStatus } from '@/utils/constants';

import { verificationsService } from './verifications.service';

export const createEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const me = req.user!;

  try {
    const token = createToken();
    const link = createLink(req, {
      path: `/verifications/email/${token}`,
    });

    await Promise.all([
      verificationsService.createEmailVerification({
        userId: me.id,
        payload: token,
      }),
      emailService.sendEmail({
        text: `Please, verify your email by following this link: 👉 ${link} `,
      }),
    ]);

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
    const error = await verificationsService.checkEmailByToken(token);
    if (typeof error === 'string') {
      throw new BadRequest(error);
    }

    const verification = error;

    await Promise.all([
      profilesService.toggleIsEmailVerified(verification.userId, true),
      verificationsService.deleteEmailVerification(verification.id),
    ]);

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
