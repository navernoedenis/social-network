import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import {
  confirmPhone,
  updatePassword,
  updatePhone,
} from './profiles.controllers';
import {
  confirmPhoneSchema,
  updatePasswordSchema,
  updatePhoneSchema,
} from './profiles.schemas';

export const profilesRouter = Router();

profilesRouter
  .put('/phone', validateBody(updatePhoneSchema), updatePhone)
  .post('/phone/confirm', validateBody(confirmPhoneSchema), confirmPhone)
  .put('/password', validateBody(updatePasswordSchema), updatePassword);
