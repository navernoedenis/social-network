import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { authService } from '@/resources/auth';
import { emailService } from '@/utils/services';
import { passwordsService } from '@/resources/passwords';
import { sessionsTokensService } from '@/resources/session-tokens';
import { usersService } from '@/resources/users';
import { verificationsService } from '@/resources/verifications';

import { authCookie, httpStatus } from '@/utils/constants';
import {
  BadRequest,
  checkIsExpired,
  Conflict,
  createCookieTokenWithOptions,
  createHash,
  createJwtTokens,
  createLink,
  createSecureCookieOptions,
  createToken,
  getExpiredAt,
  InternalServerError,
  parseCookieToken,
  Unauthorized,
  verifyHash,
  verifyJwtToken,
} from '@/utils/helpers';

import {
  type ForgotPasswordDto,
  type LoginDto,
  type SignUpDto,
  type UpdatePasswordDto,
} from './auth.types';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as SignUpDto;

  try {
    const user = await usersService.findByEmail(email);
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

    const link = createLink(req, {
      path: `/verifications/email/${token}`,
    });

    await emailService.sendEmail({
      text: `Your email verification link: ${link}`,
    });

    const message =
      'Congratulations, your account has been successfully created. ' +
      'We sent a verification link. Please, check your email';

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
    const user = await usersService.findByEmail(loginDto.email, {
      withProfile: true,
    });
    if (!user) {
      throw new Unauthorized('No user with this email');
    }

    const password = await passwordsService.getPassword(user.id);

    const isPasswordsMatch = await verifyHash(loginDto.password, password.hash);
    if (!isPasswordsMatch) {
      return (
        res
          .status(httpStatus.BAD_REQUEST)
          // If user has 2FA-authentication and passwords
          // do not match, we have to remove 2FA-cookie,
          // and they have to repeat all steps from beginning.
          .clearCookie(authCookie.twoFA)
          .json({
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            error: 'Wrong user password. Try to login one more time',
          } as HttpResponse)
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newTokens = createJwtTokens(tokenPayload);
    await sessionsTokensService.createOne(req, {
      userId: user.id,
      token: newTokens.refreshToken,
    });

    const cookieToken = createCookieTokenWithOptions(newTokens.refreshToken, {
      rememberMe: loginDto.rememberMe,
    });

    res
      .status(httpStatus.OK)
      .cookie(authCookie.refreshToken, cookieToken.token, cookieToken.options)
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: {
          accessToken: newTokens.accessToken,
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
  const { refreshToken } = parseCookieToken(req.cookies);

  try {
    if (refreshToken) {
      await sessionsTokensService.deleteOne(refreshToken);
    }

    res
      .status(httpStatus.OK)
      .clearCookie(authCookie.refreshToken)
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

export const updateTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieToken = parseCookieToken(req.cookies);
  const refreshToken = cookieToken.refreshToken!;

  try {
    const user = verifyJwtToken(refreshToken, 'refresh');
    if (!user) {
      throw new Unauthorized('Invalid refresh token');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newTokens = createJwtTokens(tokenPayload);
    const newCookieToken = createCookieTokenWithOptions(
      newTokens.refreshToken,
      {
        rememberMe: !cookieToken.isExpired,
      }
    );

    await sessionsTokensService.createOne(req, {
      userId: user.id,
      token: newTokens.refreshToken,
    });

    res
      .status(httpStatus.OK)
      .cookie(
        authCookie.refreshToken,
        newCookieToken.token,
        newCookieToken.options
      )
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: newTokens.accessToken,
        message: 'You have received a new pair of tokens! 🍐🍏',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const forgotPasswordDto = req.body as ForgotPasswordDto;

  try {
    const user = await usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new Unauthorized('No user with this email');
    }

    const verification =
      await verificationsService.getForgotPasswordVerification({
        userId: user.id,
      });

    if (verification) {
      if (checkIsExpired(verification.expiredAt)) {
        await verificationsService.deleteForgotPasswordVerification(
          verification.id
        );

        const message =
          'You forgot password verification token has been expired. ' +
          'Create another one!';

        throw new BadRequest(message);
      }

      const message =
        'You have already created a forgot password verification. ' +
        'Follow the link which was send on your email';

      throw new Conflict(message);
    }

    const token = createToken();
    await verificationsService.createForgotPasswordVerification({
      userId: user.id,
      payload: token,
    });

    const passwordToken = user.id + '&' + token;
    const link = createLink(req, {
      path: `/auth/forgot-password/${passwordToken}`,
    });

    await emailService.sendEmail({
      text: `Your forgot password verification link: ${link}`,
    });

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message:
        'Forgot password verification was created ✨. ' +
        'Check you email address',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const passwordToken = req.params.token ?? '';

  try {
    const [userId, token] = passwordToken.split('&');
    if (!userId || !token) {
      throw new BadRequest('Invalid forgot password token');
    }

    const verification =
      await verificationsService.getForgotPasswordVerification({
        userId: +userId,
      });

    if (!verification || verification.payload !== token) {
      throw new BadRequest('Invalid forgot password token');
    }

    if (checkIsExpired(verification.expiredAt)) {
      await verificationsService.deleteForgotPasswordVerification(
        verification.id
      );

      const message =
        'You forgot password token was expired. Create another one';

      throw new BadRequest(message);
    }

    const cookieOptions = createSecureCookieOptions({
      expires: getExpiredAt(15, 'minutes'),
    });

    res
      .status(httpStatus.OK)
      .cookie(authCookie.forgotPasswordToken, passwordToken, cookieOptions)
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: null,
        message: 'Forgot password token was verified 🍒',
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
  const passwordToken: string =
    req.cookies[authCookie.forgotPasswordToken] ?? '';

  try {
    if (!passwordToken) {
      throw new BadRequest('No forgot password token');
    }

    const [userId, token] = passwordToken.split('&');
    if (!userId || !token) {
      throw new BadRequest('Invalid password token');
    }

    const verification =
      await verificationsService.getForgotPasswordVerification({
        userId: +userId,
      });

    if (!verification || verification.payload !== token) {
      throw new BadRequest('Invalid password token');
    }

    if (checkIsExpired(verification.expiredAt)) {
      await verificationsService.deleteForgotPasswordVerification(
        verification.id
      );
      throw new BadRequest('Password token was expired, create another one');
    }

    const updatePasswordDto = req.body as UpdatePasswordDto;
    const newPassword = await createHash(updatePasswordDto.password);

    await Promise.all([
      verificationsService.deleteForgotPasswordVerification(verification.id),
      passwordsService.updatePassword(+userId, newPassword),
    ]);

    res
      .status(httpStatus.OK)
      .clearCookie(authCookie.forgotPasswordToken)
      .json({
        success: true,
        statusCode: httpStatus.OK,
        data: null,
        message: 'Your password has been updated🤘',
      } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
