import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import {
  confirmPhone,
  updateData,
  updatePassword,
  updatePhone,
} from './profiles.controllers';

import {
  confirmPhoneSchema,
  updateDataSchema,
  updatePasswordSchema,
  updatePhoneSchema,
} from './profiles.schemas';

import { isUsernameTaken } from './profiles.middlewares';

export const profilesRouter = Router();

profilesRouter
  .put('/me', validateBody(updateDataSchema), isUsernameTaken, updateData)
  .patch('/phone', validateBody(updatePhoneSchema), updatePhone)
  .post('/phone/confirm', validateBody(confirmPhoneSchema), confirmPhone)
  .patch('/password', validateBody(updatePasswordSchema), updatePassword);
