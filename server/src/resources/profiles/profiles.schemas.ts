import z from 'zod';
import { phoneRegex } from './profiles.regex';

const OTP_PASSWORD_LENGTH = 6;
const trimedString = z.string().trim().toLowerCase();

const password = trimedString
  .min(8)
  .max(25)
  .regex(/[a-zAz]/, 'At least one letter');

export const updateDataSchema = z.object({
  about: trimedString.max(200, 'About field must be not more than 200 letters'),
  birthday: z.date().nullable(),
  username: trimedString
    .max(30, 'Maximum length of a username is 30 letters')
    .nullable(),
});

export const updatePhoneSchema = z.object({
  // example: "+38 (097) 777-8899"
  phone: z.string().regex(phoneRegex, 'Invalid phone number').nullable(),
});

export const confirmPhoneSchema = z
  .object({ otp: z.number() })
  .refine((schema) => `${schema.otp}`.length === OTP_PASSWORD_LENGTH, {
    message: `Otp password must contain only ${OTP_PASSWORD_LENGTH} digits`,
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: password,
    password,
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.currentPassword !== schema.password, {
    message: 'Your new password is the same like current one',
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'New and confirm passwords do not match',
  });
