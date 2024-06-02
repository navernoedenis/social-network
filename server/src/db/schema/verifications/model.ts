import { emailVerifications, twoFactorVerifications } from './entity';

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type NewEmailVerification = typeof emailVerifications.$inferInsert;

export type TwoFactorVerification = typeof twoFactorVerifications.$inferSelect;
export type NewTwoFactorVerification =
  typeof twoFactorVerifications.$inferInsert;
