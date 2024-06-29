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

const validators = {
  confirmPhone: [validateBody(confirmPhoneSchema)],
  updateData: [validateBody(updateDataSchema), isUsernameTaken],
  updatePassword: [validateBody(updatePasswordSchema)],
  updatePhone: [validateBody(updatePhoneSchema)],
};

profilesRouter
  .patch('/me', validators.updateData, updateData)
  .put('/phone', validators.updatePhone, updatePhone)
  .post('/phone/confirm', validators.confirmPhone, confirmPhone)
  .put('/password', validators.updatePassword, updatePassword);
