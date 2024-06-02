import { users } from './entity';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
