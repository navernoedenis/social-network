import { verifications } from './entity';

export type NewVerification = typeof verifications.$inferInsert;
export type Verification = typeof verifications.$inferSelect;
export type VerificationType = Verification['type'];
