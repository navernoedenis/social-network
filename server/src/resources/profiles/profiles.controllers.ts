import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { passwordsService } from '@/resources/passwords';
import { phoneService } from '@/utils/services';
import { profilesService } from './profiles.service';
import { usersService } from '@/resources/users';
import { verificationsService } from '@/resources/verifications';

import { httpStatus } from '@/utils/constants';
import {
  BadRequest,
  createHash,
  createOtpPassword,
  verifyHash,
} from '@/utils/helpers';

import {
  type ConfirmPhoneDto,
  type UpdateDataDto,
  type UpdatePasswordDto,
  type UpdatePhoneDto,
} from './profiles.types';

export const updateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, ...otherUpdateData } = req.body as UpdateDataDto;
  const user = req.user!;

  try {
    const promises: Promise<unknown>[] = [
      profilesService.updateFields(user.id, otherUpdateData),
    ];

    const isUsernameEmpty = username?.trim().length === 0;
    if (!isUsernameEmpty) {
      const promise = usersService.updateFields(user.id, {
        username,
      });
      promises.push(promise);
    }

    await Promise.all(promises);
    const updatedProfile = await profilesService.getProfile(user.id);

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: updatedProfile,
      message: 'You profile data has been updated 🏡',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const updatePhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.body as UpdatePhoneDto;
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
    if (profile.phone === dto.phone) {
      throw new BadRequest('You already have this phone number');
    }

    const shouldResetPhone = !!dto.phone === false;
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
      profilesService.updatePhone(user.id, dto.phone),
      phoneService.sendSms({
        text: `Your phone verification code: ${otp} `,
      }),
      verificationsService.createPhoneVerification({
        userId: user.id,
        payload: `${otp}`,
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
  const dto = req.body as ConfirmPhoneDto;
  const user = req.user!;

  try {
    const verification = await verificationsService.getPhoneVerification({
      userId: user.id,
    });

    if (!verification) {
      throw new BadRequest('No phone verification');
    }

    const otp = +verification.payload;
    if (dto.otp !== otp) {
      throw new BadRequest('Passwords do not match');
    }

    await Promise.all([
      profilesService.toggleIsPhoneVerified(user.id, true),
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
  const dto = req.body as UpdatePasswordDto;
  const user = req.user!;

  try {
    const currentPassword = await passwordsService.getPassword(user.id);

    const isCurrentPasswordMatch = await verifyHash(
      dto.currentPassword,
      currentPassword.hash
    );
    if (!isCurrentPasswordMatch) {
      throw new BadRequest('Your current password is wrong');
    }

    const hash = await createHash(dto.password);
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
