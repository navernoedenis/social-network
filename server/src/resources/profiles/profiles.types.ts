import { z } from 'zod';
import {
  confirmPhoneSchema,
  updatePasswordSchema,
  updatePhoneSchema,
} from './profiles.schemas';

export type ConfirmPhoneDto = z.infer<typeof confirmPhoneSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
export type UpdatePhoneDto = z.infer<typeof updatePhoneSchema>;

export type SwitchKey = 'active' | 'email' | 'official' | 'phone';
