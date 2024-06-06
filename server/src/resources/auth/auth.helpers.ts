import { type CookieOptions } from 'express';
import { ENV } from '@/app/env';
import { getExpiredAt, checkIsExpired } from '@/utils/helpers';
import {
  type CookieToken,
  type CookieTokenOptions,
  type ParseCookieToken,
} from './auth.types';

export const parseCookieToken = (
  cookies: Record<string, unknown>
): ParseCookieToken => {
  const { refreshToken = '' } = cookies as { refreshToken: string };
  if (!refreshToken) {
    return { hasToken: false };
  }

  const { token, expiredAt } = JSON.parse(refreshToken) as CookieToken;

  return {
    hasToken: true,
    isExpired: checkIsExpired(expiredAt),
    refreshToken: token,
  };
};

export const createCookieTokenWithOptions = (
  refreshToken: string,
  config: CookieTokenOptions
) => {
  return {
    token: createCookieToken(refreshToken, config),
    options: createCookieTokenOptions(config),
  };
};

const createCookieToken = (
  refreshToken: string,
  config: CookieTokenOptions
) => {
  const cookieToken: CookieToken = {
    token: refreshToken,
    expiredAt: config.rememberMe ? getExpiredAt(30, 'days') : undefined,
  };

  return JSON.stringify(cookieToken);
};

const createCookieTokenOptions = (
  config: CookieTokenOptions
): CookieOptions => {
  return {
    expires: config.rememberMe ? getExpiredAt(30, 'days') : undefined,
    httpOnly: true,

    // TODO: Sort it out!!!
    // Problem: If I set path /auth or any other, except default slash,
    // Chrome will remove cookie after reload tab or close browser.
    // Firefox works fine.
    path: '/',

    sameSite: 'lax',
    secure: ENV.IS_PRODUCTION,
  };
};
