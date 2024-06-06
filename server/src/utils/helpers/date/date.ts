import { MILLISECONDS_IN } from './constants';

export const getExpiredAt = (
  value: number,
  type: keyof typeof MILLISECONDS_IN
) => {
  const expiredTime = Date.now() + value * MILLISECONDS_IN[type];
  return new Date(expiredTime);
};

export const checkIsExpired = (expiredAt: Date | undefined) => {
  if (!expiredAt) return true;
  const endTime = new Date(expiredAt);
  const now = new Date();
  return now >= endTime;
};
