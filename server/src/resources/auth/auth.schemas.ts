import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z
    .string()
    .min(8)
    .max(25)
    .regex(/[a-zAz]/, { message: 'At least one letter' }),
});

export const signUpSchema = z
  .object({
    confirmPassword: z.string(),
  })
  .merge(loginSchema)
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords don't match",
  });
