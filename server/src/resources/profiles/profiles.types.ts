import z from 'zod';
import { type Profile } from '@/db/files/models';
import {
  confirmPhoneSchema,
  updateDataSchema,
  updatePasswordSchema,
  updatePhoneSchema,
} from './profiles.schemas';

export type ConfirmPhoneDto = z.infer<typeof confirmPhoneSchema>;
export type UpdateDataDto = z.infer<typeof updateDataSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
export type UpdatePhoneDto = z.infer<typeof updatePhoneSchema>;

export type SwitchKey = keyof Pick<
  Profile,
  'isActive' | 'isEmailVerified' | 'isOfficial' | 'isPhoneVerified'
>;

export type UpdateFields = Partial<Pick<Profile, 'about' | 'birthday'>>;
