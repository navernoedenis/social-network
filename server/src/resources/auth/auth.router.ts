import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import {
  forgotPassword,
  login,
  logout,
  signup,
  updatePassword,
  verifyCookieToken,
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
  .post('/logout', logout)
  .post('/verify-token', verifyCookieToken)
  .post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword)
  .post('/forgot-password/:token', verifyForgotPasswordToken)
  .patch(
    '/forgot-password',
    validateBody(updatePasswordSchema),
    updatePassword
  );
