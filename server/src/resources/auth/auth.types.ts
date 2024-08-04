import z from 'zod';
import {
  forgotPasswordSchema,
  loginSchema,
  updatePasswordSchema,
  signUpSchema,
} from './auth.schemas';

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

export type SignUpDto = z.infer<typeof signUpSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;

export type LoginTwoFaDto = LoginDto & { otp: number };
export type TwoFaPayload = LoginTwoFaDto;

export type SignUpData = {
  email: string;
  password: string;
  username: string;
  verificationToken: string;
};
