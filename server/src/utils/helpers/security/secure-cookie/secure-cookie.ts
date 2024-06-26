import { type CookieOptions } from 'express';
import { ENV } from '@/app/env';

export const createSecureCookieOptions = (
  config: CookieOptions = {}
): CookieOptions => ({
  expires: config.expires,
  httpOnly: true,

  // TODO: Sort it out!!!
  // Problem: If I set path /auth or any other, except default slash,
  // Chrome will remove cookie after reload tab or close browser.
  // Firefox works fine.
  path: config.path ?? '/',
  sameSite: config.sameSite ?? 'lax',
  secure: ENV.IS_PRODUCTION,
});
