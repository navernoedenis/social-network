import { sessionTokens } from './entity';

export type SessionToken = typeof sessionTokens.$inferSelect;
export type NewSessionToken = typeof sessionTokens.$inferInsert;
