import { type CookieOptions } from 'express';
import {
  type CookieToken,
  type CookieTokenOptions,
  type ParseCookieToken,
} from './cookie-token.types';

import {
  checkIsExpired,
  createSecureCookieOptions,
  getExpiredAt,
} from '@/utils/helpers';

export const parseCookieToken = (
  cookies: Record<string, unknown>
): ParseCookieToken => {
  const { refreshToken = '' } = cookies as { refreshToken: string };

  if (!refreshToken) {
    return {
      hasToken: false,
    };
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
  return createSecureCookieOptions({
    expires: config.rememberMe ? getExpiredAt(30, 'days') : undefined,
  });
};
