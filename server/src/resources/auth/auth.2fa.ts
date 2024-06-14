import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { emailService } from '@/utils/services';
import { usersService } from '@/resources/users';
import { verificationsService } from '@/resources/verifications';

import { authCookie, httpStatus } from '@/utils/constants';
import {
  checkIsExpired,
  createOtpPassword,
  createSecureCookieOptions,
  decryptData,
  encryptData,
  getExpiredAt,
  Unauthorized,
} from '@/utils/helpers';

import { createTwoFaPayload, parseTwoFaPayload } from './auth.helpers';
import { type LoginDto, type LoginTwoFaDto } from './auth.types';

// 2FA Implementation:
// 1. user send in body: email, password and rememberMe +
// 2. we add middleware that checks, whether the user has 2FA in settings +
// 3. if no, skip all next steps: next() +
// 4. if yes: +
// 5. we check security 2FA-cookie (with userId): +

// 6. if no 2FA-cookie and user has 2FA-verification in db:
// 7. Check vericaiton expiredAt: if epxired, remove from db.... send unauthorized response +
// 8. if no 2FA-cookie and no 2FA-verification in db: +
// 9. we create 2FA-verification, 2FA-payload and otp-password, +
// 10. we add 2FA-payload to db and send email/sms with otp-password +
// 11. send 201 status with 2FA-cookie (userId) and message: "2fa verification has been created" +
// 12. (client part): redirect user on otp-password page, they text password and press next-button +
// 13. (client part): again send request on login enpoint with otp-password in req.body +

// middleware check us again:
// 14. we have 2FA-cookie and check is 2FA-verification exists in db +
// 15. if no 2FA-verification in db: we delete 2FA-cookie and send: Unauthorized response +
// 16. if yes and 2FA-verification expired: delete 2FA-cookie and 2FA-verifcaiton +
// 17. Send unauthorized response: Verification expired +
// 18. if 2FA-verification exists and no expired: +
// 19. we parse payload from 2FA-verifcation: email:password:otp:rememberMe
// 20. we check otp passwords, in they don't match, we send unathororized error: wrong password +
// 21. if they match, we remove 2FA-verification from db +
// 22  add credential to req.body from 2FA-payload: email, password, rememberMe and call next() +

export const twoFactorAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginDto = req.body as LoginDto;

    // Todo: replace on settings service
    const user = await usersService.findByEmail(loginDto.email, {
      withSettings: true,
    });

    if (!user) {
      throw new Unauthorized('No user with this email');
    }

    if (!user.settings.is2faEnabled) {
      return next();
    }

    const twoFaCookie: string = req.cookies[authCookie.twoFA] ?? '';
    const twoFaVerification = await verificationsService.get2FAVerification({
      userId: user.id,
      skipExpireCheking: true,
    });

    if (!twoFaCookie && twoFaVerification) {
      if (checkIsExpired(twoFaVerification.expiredAt)) {
        await verificationsService.delete2FAVerification(twoFaVerification.id);
        throw new Unauthorized(
          'You 2FA verification was expired. Try to login again'
        );
      }

      throw new Unauthorized('Have no 2FA cookie');
    }

    if (!twoFaCookie && !twoFaVerification) {
      const otp = createOtpPassword();

      const twoFaPayload = createTwoFaPayload({
        email: user.email,
        otp,
        password: loginDto.password,
        rememberMe: loginDto.rememberMe,
      });

      const minutesExp = 5;
      const expiredAt = getExpiredAt(minutesExp, 'minutes');

      await Promise.all([
        verificationsService.create2FAVerification({
          userId: user.id,
          payload: encryptData(twoFaPayload),
          expiredAt,
        }),
        emailService.sendEmail({
          text: `Your 2FA password is: ${otp}`,
        }),
      ]);

      const cookieOptions = createSecureCookieOptions({
        expires: expiredAt,
      });

      return res
        .status(httpStatus.CREATED)
        .cookie(authCookie.twoFA, user.id, cookieOptions)
        .json({
          success: true,
          statusCode: httpStatus.CREATED,
          data: null,
          message:
            '2FA verification has been created. ' +
            `You have ${minutesExp} minutes before 2FA code be expired`,
        } as HttpResponse);
    }

    if (twoFaCookie && !twoFaVerification) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .clearCookie(authCookie.twoFA)
        .json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          error: 'Invalid 2FA cookie',
        } as HttpResponse);
    }

    if (!twoFaVerification) {
      throw new Unauthorized("2FA verification hasn't been found");
    }

    if (checkIsExpired(twoFaVerification.expiredAt)) {
      await verificationsService.delete2FAVerification(twoFaVerification.id);

      return res
        .status(httpStatus.UNAUTHORIZED)
        .clearCookie(authCookie.twoFA)
        .json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          error:
            'Too late. Your 2FA verification was expired. ' +
            'Try to login one more time',
        } as HttpResponse);
    }

    const twoFaDto = req.body as LoginTwoFaDto;
    if (!twoFaDto.otp) {
      throw new Unauthorized('Have no 2FA password');
    }

    const twoFaPayload = parseTwoFaPayload(
      decryptData(twoFaVerification.payload)
    );

    if (twoFaPayload.otp !== twoFaDto.otp) {
      throw new Unauthorized('Wrong 2FA password');
    }

    await verificationsService.delete2FAVerification(twoFaVerification.id);

    req.body = {
      email: twoFaPayload.email,
      password: twoFaPayload.password,
      rememberMe: twoFaPayload.rememberMe,
    };

    next();
  } catch (error) {
    next(error);
  }
};
