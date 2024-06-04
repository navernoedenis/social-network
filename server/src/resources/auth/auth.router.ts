import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import { login, logout, signup } from './auth.controllers';
import { loginSchema, signUpSchema } from './auth.schemas';

export const authRouter = Router();

authRouter
  .post('/signup', validateBody(signUpSchema), signup)
  .post('/login', validateBody(loginSchema), login)
  .post('/logout', logout);
