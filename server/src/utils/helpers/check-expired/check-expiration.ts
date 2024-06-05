export const checkIsExpired = (expiredAt: Date) => {
  const endTime = new Date(expiredAt);
  const now = new Date();
  return now >= endTime;
};
