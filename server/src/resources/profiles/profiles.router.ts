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
  .patch('/me', validateBody(updateDataSchema), isUsernameTaken, updateData)
  .put('/phone', validateBody(updatePhoneSchema), updatePhone)
  .post('/phone/confirm', validateBody(confirmPhoneSchema), confirmPhone)
  .put('/password', validateBody(updatePasswordSchema), updatePassword);
