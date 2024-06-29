import jwt from 'jsonwebtoken';
import { ENV } from '@/app/env';
import { type AuthUser } from '@/types/main';

import { getErrorMessage } from '@/utils/helpers';
import { print } from '@/utils/lib';

type JwtType = 'access' | 'refresh';

const settings: Record<JwtType, [string, string]> = {
  access: [ENV.JWT_ACCESS_SECRET, ENV.IS_PRODUCTION ? '15m' : '1d'],
  refresh: [ENV.JWT_REFRESH_SECRET, '30d'],
};

type JwtPayload = AuthUser;

export const createJwtTokens = (payload: JwtPayload) => ({
  accessToken: createJwtToken(payload, 'access'),
  refreshToken: createJwtToken(payload, 'refresh'),
});

export const createJwtToken = (
  payload: JwtPayload,
  type: JwtType = 'access'
) => {
  const [secret, expiresIn] = settings[type];

  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyJwtToken = (token: string, type: JwtType) => {
  const [secret] = settings[type];

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    print.error(getErrorMessage(error));
    return null;
  }
};
