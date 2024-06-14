import { users } from './entity';

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
