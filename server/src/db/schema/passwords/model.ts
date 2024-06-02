import { passwords } from './entity';

export type Password = typeof passwords.$inferSelect;
export type NewPassword = typeof passwords.$inferInsert;
