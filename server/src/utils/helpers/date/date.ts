import { MILLISECONDS_IN } from '@/utils/constants';

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

export const getDate = (date: Date | string) => {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return {
    day,
    month,
    monthLong: d.toLocaleDateString('default', { month: 'long' }),
    monthShort: d.toLocaleDateString('default', { month: 'short' }),
    year,
  };
};
