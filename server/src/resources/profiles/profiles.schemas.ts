import z from 'zod';

const phoneRegex = new RegExp(/^(\+\d{1,2}\s)\(\d{3}\)[\s-]\d{3}[\s-]\d{4}$/);
const OTP_PASSWORD_LENGTH = 6;

const password = z
  .string()
  .min(8)
  .max(25)
  .regex(/[a-zAz]/, { message: 'At least one letter' });

// schema example: "+38 (097) 777-8899"
export const updatePhoneSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone number').nullable(),
});

export const confirmPhoneSchema = z
  .object({
    otp: z.number(),
  })
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
