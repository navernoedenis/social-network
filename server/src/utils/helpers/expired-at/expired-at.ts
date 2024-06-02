export const MILLISECONDS_IN = {
  seconds: 1_000,
  minutes: 60_000,
  hours: 3.6e6,
  days: 8.64e7,
};

export const expiredAt = (
  value: number,
  type: keyof typeof MILLISECONDS_IN
) => {
  const expiredTime = value * MILLISECONDS_IN[type] + Date.now();
  return new Date(expiredTime);
};
