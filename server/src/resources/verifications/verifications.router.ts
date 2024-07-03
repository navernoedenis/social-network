import { Router } from 'express';
import { isAuthorized } from '@/utils/middlewares';
import {
  createEmailVerification,
  verifyEmailToken,
} from './verifications.controllers';

import {
  checkIsEmailVerificationExists,
  checkIsEmailVerified,
} from './verifications.middlewares';

export const verificationsRouter = Router();

verificationsRouter
  .post(
    '/email',
    isAuthorized,
    checkIsEmailVerified,
    checkIsEmailVerificationExists,
    createEmailVerification
  )
  .get('/email/:token', verifyEmailToken);
