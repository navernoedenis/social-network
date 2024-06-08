import { type CookieOptions } from 'express';
import { getExpiredAt, checkIsExpired } from '@/utils/helpers';
import { createSecureCookieOptions } from '@/utils/lib';
import {
  type CookieToken,
  type CookieTokenOptions,
  type ParseCookieToken,
  type TwoFaPayload,
} from './auth.types';

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

export const createTwoFaPayload = (payload: TwoFaPayload) => {
  const { email, password, otp, rememberMe } = payload;
  return `${email}:${password}:${otp}:${rememberMe}`;
};

export const parseTwoFaPayload = (payload: string): TwoFaPayload => {
  const [email, password, otp, rememberMe] = payload.split(':');

  return {
    email,
    password,
    otp: +otp,
    rememberMe: JSON.parse(rememberMe),
  };
};
