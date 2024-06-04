import { ENV } from '@/app/env';
import { authService } from '@/resources/auth';
import { usersService } from '@/resources/users';
import { httpStatus } from '@/utils/constants';
import { createHash, createJwtToken, verifyHash, print } from '@/utils/lib';
import {
  Conflict,
  createToken,
  getExpiredAt,
  InternalServerError,
  Unauthorized,
} from '@/utils/helpers';

import {
  type Request,
  type Response,
  type NextFunction,
  type HttpResponse,
} from '@/types/main';

import { type LoginDto, type SignUpDto } from './auth.types';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as SignUpDto;

  try {
    const user = await usersService.findOne(email);
    if (user) {
      throw new Conflict('Email is already taken');
    }

    const token = createToken();
    const hash = await createHash(password);

    const { error } = await authService.signUp({
      email,
      password: hash,
      token,
    });
    if (error) {
      throw new InternalServerError(error);
    }

    // TODO: ADD EMAIL SERVICE
    print.info('Your verificatioin token is: ', token);

    const message =
      'Congratulations, your account has been successfully created. ' +
      'Please, check your email. We sent an verification on ' +
      email;

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message,
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginDto = req.body as LoginDto;

  try {
    const user = await usersService.findOne(loginDto.email, {
      withProfile: true,
    });
    if (!user) {
      throw new Unauthorized('No user with this email');
    }

    const password = await usersService.getUserPassword(user.id);
    const isPasswordsMatch = await verifyHash(loginDto.password, password.hash);
    if (!isPasswordsMatch) {
      throw new Unauthorized('Wrong password');
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
    };

    // TODO: Add refresh tokens service: ip, browser....

    res
      .status(httpStatus.OK)
      .cookie('refreshToken', createJwtToken(tokenPayload, 'refresh'), {
        expires: getExpiredAt(30, 'days'),
        httpOnly: true,
        path: '/auth/verify-refresh',
        sameSite: 'lax',
        secure: ENV.IS_PRODUCTION,
      })
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: {
          accessToken: createJwtToken(tokenPayload, 'access'),
          user,
        },
        message: 'Login successfully',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(httpStatus.OK)
      .clearCookie('refreshToken')
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: null,
        message: 'Logout successfully',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
