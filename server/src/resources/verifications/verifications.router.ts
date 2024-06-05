import { Router } from 'express';
import { validateBody, isAuthorized } from '@/utils/middlewares';
import { newEmailVerificationSchema } from './verifications.schemas';
import { verifyEmail, newEmailVerification } from './verifications.controllers';
import {
  checkIsEmailVerified,
  checkIsExistsEmailVerification,
} from './verifications.middlewares';

export const verificationsRouter = Router();

verificationsRouter
  .post(
    '/email/new',
    [
      isAuthorized,
      checkIsEmailVerified,
      checkIsExistsEmailVerification,
      validateBody(newEmailVerificationSchema),
    ],
    newEmailVerification
  )
  .post('/email/:token', verifyEmail);
