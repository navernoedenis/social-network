import { type TwoFaPayload } from './auth.types';

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
