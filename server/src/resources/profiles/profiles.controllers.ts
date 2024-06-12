import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { passwordsService } from '@/resources/passwords';
import { verificationsService } from '@/resources/verifications';

import {
  BadRequest,
  createHash,
  createOtpPassword,
  verifyHash,
} from '@/utils/helpers';
import { phoneService } from '@/utils/services';
import { httpStatus } from '@/utils/constants';

import { profilesService } from './profiles.service';
import {
  type ConfirmPhoneDto,
  type UpdatePasswordDto,
  type UpdatePhoneDto,
} from './profiles.types';

export const updatePhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updatePhoneDto = req.body as UpdatePhoneDto;
  const user = req.user!;

  try {
    const verification = await verificationsService.getPhoneVerification({
      userId: user.id,
    });

    if (verification) {
      const message =
        'You cant update your phone number ' +
        'while you have a previous phone verification';

      throw new BadRequest(message);
    }

    const profile = await profilesService.getProfile(user.id);
    if (profile.phone === updatePhoneDto.phone) {
      throw new BadRequest('You already have this phone number');
    }

    const shouldResetPhone = !!updatePhoneDto.phone === false;
    if (shouldResetPhone) {
      await profilesService.updatePhone(user.id, null);
      return res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        data: null,
        message: 'Your phone number has been reset',
      } as HttpResponse);
    }

    const otp = createOtpPassword();

    await Promise.all([
      profilesService.updatePhone(user.id, updatePhoneDto.phone),
      verificationsService.createPhoneVerification({
        userId: user.id,
        payload: `${otp}`,
      }),
      phoneService.sendSms({
        text: `Your phone verification code: ${otp} `,
      }),
    ]);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You have been sent sms with a verification code',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const confirmPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const confirmPhoneDto = req.body as ConfirmPhoneDto;
  const user = req.user!;

  try {
    const verification = await verificationsService.getPhoneVerification({
      userId: user.id,
    });

    if (!verification) {
      throw new BadRequest('No phone verification');
    }

    const otp = +verification.payload;
    if (confirmPhoneDto.otp !== otp) {
      throw new BadRequest('Passwords do not match');
    }

    await Promise.all([
      profilesService.switchIsPhoneVerified(user.id, true),
      verificationsService.deletePhoneVerification(verification.id),
    ]);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'You phone number has been confirmed ✅',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updatePasswordDto = req.body as UpdatePasswordDto;
  const user = req.user!;

  try {
    const currentPassword = await passwordsService.getPassword(user.id);

    const isCurrentPasswordMatch = await verifyHash(
      updatePasswordDto.currentPassword,
      currentPassword.hash
    );
    if (!isCurrentPasswordMatch) {
      throw new BadRequest('Your current password is wrong');
    }

    const hash = await createHash(updatePasswordDto.password);
    await passwordsService.updatePassword(user.id, hash);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'Your password has been updated 🔒',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
