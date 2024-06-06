import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { authService } from '@/resources/auth';
import { passwordsService } from '@/resources/passwords';
import { usersService } from '@/resources/users';

import { httpStatus } from '@/utils/constants';
import {
  createHash,
  createJwtTokens,
  print,
  verifyHash,
  verifyJwtToken,
} from '@/utils/lib';

import {
  Conflict,
  createToken,
  InternalServerError,
  Unauthorized,
} from '@/utils/helpers';

import { createCookieTokenWithOptions, parseCookieToken } from './auth.helpers';
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

    const { error: signUpError, data: newUser } = await authService.signUp({
      email,
      password: hash,
      verificationToken: token,
    });

    if (!newUser) {
      throw new InternalServerError(signUpError);
    }

    // TODO: Send Email Service:
    print.info(
      'Your verification link: ',
      `${req.protocol}://${req.headers.host}/verifications/email/${token}`
    );

    const message =
      'Congratulations, your account has been successfully created. ' +
      'Please, check your email. We sent a verification link on your email';

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

    const password = await passwordsService.getUserPassword(user.id);

    const isPasswordsMatch = await verifyHash(loginDto.password, password.hash);
    if (!isPasswordsMatch) {
      throw new Unauthorized('Wrong password');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // TODO: Add refresh tokens service: ip, browser....
    // and invalidate old ones

    const { accessToken, refreshToken } = createJwtTokens(tokenPayload);
    const cookieToken = createCookieTokenWithOptions(refreshToken, {
      rememberMe: loginDto.rememberMe,
    });

    res
      .status(httpStatus.OK)
      .cookie('refreshToken', cookieToken.token, cookieToken.options)
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: {
          accessToken,
          user,
        },
        message: 'Login successfully',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res
    .status(httpStatus.OK)
    .clearCookie('refreshToken')
    .json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'Logout successfully',
    } as HttpResponse);
};

export const verifyCookieToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hasToken, isExpired, refreshToken } = parseCookieToken(req.cookies);
    if (!hasToken) {
      throw new Unauthorized('No refresh token');
    }

    const user = verifyJwtToken(refreshToken, 'refresh');
    if (!user) {
      throw new Unauthorized('Invalid refresh token');
    }

    // TODO: Invalidate refreshTokens via service

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newTokens = createJwtTokens(tokenPayload);
    const cookieToken = createCookieTokenWithOptions(newTokens.refreshToken, {
      rememberMe: !isExpired,
    });

    res
      .status(httpStatus.OK)
      .cookie('refreshToken', cookieToken.token, cookieToken.options)
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: {
          accessToken: newTokens.accessToken,
        },
        message: 'You have received a new pair of tokens! 🍐🍏',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
