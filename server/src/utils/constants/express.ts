import { type CookieOptions } from 'express';
import { ENV } from '@/app/env';
import { getExpiredAt } from '@/utils/helpers';

export const refreshCookieOptions: CookieOptions = {
  expires: getExpiredAt(30, 'days'),
  httpOnly: true,
  path: '/auth/verify-refresh',
  sameSite: 'lax',
  secure: ENV.IS_PRODUCTION,
};
