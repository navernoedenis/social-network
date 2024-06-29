import { Router } from 'express';
import {
  checkCookieToken,
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

const validators = {
  signup: [validateBody(signUpSchema)],
  forgotPassword: [validateBody(forgotPasswordSchema)],
  login: [validateBody(loginSchema), twoFactorAuthentication],
  updatePassword: [validateBody(updatePasswordSchema)],
  verifyToken: [checkCookieToken, verifyCookieToken],
};

authRouter
  .post('/signup', validators.signup, signup)
  .post('/login', validators.login, login)
  .post('/logout', logout)
  .post('/verify-token', validators.verifyToken, updateTokens)

  .post('/forgot-password', validators.forgotPassword, forgotPassword)
  .post('/forgot-password/:token', verifyForgotPasswordToken)
  .patch('/forgot-password', validators.updatePassword, updatePassword);
