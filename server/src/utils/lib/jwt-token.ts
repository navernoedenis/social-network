import jwt from 'jsonwebtoken';
import { ENV } from '@/app/env';
import { print } from '@/utils/lib';
import { getErrorMessage } from '@/utils/helpers';
import { type AuthUser } from '@/types/main';

type JwtType = 'access' | 'refresh';

const settings: Record<JwtType, [string, string]> = {
  access: [ENV.JWT_ACCESS_SECRET, '15m'],
  refresh: [ENV.JWT_REFRESH_SECRET, '30d'],
};

type JwtPayload = AuthUser;

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
