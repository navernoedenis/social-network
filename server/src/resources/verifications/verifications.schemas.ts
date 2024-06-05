import z from 'zod';

export const newEmailVerificationSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});
