export const CACHE_EX = {
  DAYS: (days: number) => days * (24 * 60 * 60),
  HOURS: (hours: number) => hours * (60 * 60),
  MINUTES: (minutes: number) => minutes * 60,
} as const;
