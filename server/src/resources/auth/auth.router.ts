import { Router } from 'express';
import {
  checkCookieToken,
  isAuthorized,
  validateBody,
  verifyCookieToken,
} from '@/utils/middlewares';

import {
  forgotPassword,
  login,
  logout,
  signup,
  updatePassword,
  updateTokens,
  verifyForgotPasswordToken,
} from './auth.controllers';

import { twoFactorAuthentication } from './auth.2fa';
import {
  forgotPasswordSchema,
  loginSchema,
  signUpSchema,
  updatePasswordSchema,
} from './auth.schemas';

export const authRouter = Router();

authRouter
  .post('/signup', validateBody(signUpSchema), signup)
  .post('/login', validateBody(loginSchema), twoFactorAuthentication, login)
  .get('/logout', isAuthorized, logout)
  .get('/verify-refresh', checkCookieToken, verifyCookieToken, updateTokens)

  .post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword)
  .get('/forgot-password/:token', verifyForgotPasswordToken)
  .patch(
    '/update-password',
    validateBody(updatePasswordSchema),
    updatePassword
  );
