import z from 'zod';

const email = z.string().email({ message: 'Email is required' });
const password = z
  .string()
  .min(8)
  .max(25)
  .regex(/[a-zAz]/, { message: 'At least one letter' });

export const loginSchema = z.object({
  email,
  password,
  rememberMe: z.boolean({
    message: 'Remember me field is required and must be true or false',
  }),
});

export const signUpSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords don't match",
  });

export const forgotPasswordSchema = z.object({
  email,
});

export const updatePasswordSchema = z.object({
  password,
});
