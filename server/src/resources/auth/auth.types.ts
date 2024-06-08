import { z } from 'zod';
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

export type CookieToken = {
  token: string;
  expiredAt?: Date;
};

export type CookieTokenOptions = {
  rememberMe?: boolean;
};

export type ParseCookieToken =
  | { hasToken: false; isExpired?: never; refreshToken?: never }
  | { hasToken: true; isExpired: boolean; refreshToken: string };

export type LoginTwoFaDto = LoginDto & { otp: number };
export type TwoFaPayload = LoginTwoFaDto;
