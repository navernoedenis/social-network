import { Router } from 'express';
import { isAuthorized, validateBody } from '@/utils/middlewares';
import { newEmailVerificationSchema } from './verifications.schemas';
import {
  newEmailVerification,
  verifyEmailToken,
} from './verifications.controllers';

import {
  checkIsEmailVerificationExists,
  checkIsEmailVerified,
} from './verifications.middlewares';

export const verificationsRouter = Router();

const validators = {
  newEmailVerification: [
    isAuthorized,
    checkIsEmailVerified,
    checkIsEmailVerificationExists,
    validateBody(newEmailVerificationSchema),
  ],
};

verificationsRouter
  .post('/email/new', validators.newEmailVerification, newEmailVerification)
  .get('/email/:token', verifyEmailToken);
