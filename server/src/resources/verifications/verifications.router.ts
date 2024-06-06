import { Router } from 'express';
import { validateBody, isAuthorized } from '@/utils/middlewares';
import { newEmailVerificationSchema } from './verifications.schemas';
import { verifyEmail, newEmailVerification } from './verifications.controllers';
import {
  checkIsEmailVerificationExists,
  checkIsEmailVerified,
} from './verifications.middlewares';

export const verificationsRouter = Router();

verificationsRouter
  .post(
    '/email/new',
    [
      isAuthorized,
      checkIsEmailVerified,
      checkIsEmailVerificationExists,
      validateBody(newEmailVerificationSchema),
    ],
    newEmailVerification
  )
  .get('/email/:token', verifyEmail);
