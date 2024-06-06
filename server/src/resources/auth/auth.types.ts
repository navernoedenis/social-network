import { z } from 'zod';
import { loginSchema, signUpSchema } from './auth.schemas';

export type LoginDto = z.infer<typeof loginSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;

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
