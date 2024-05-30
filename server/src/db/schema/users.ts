import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').notNull().primaryKey(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  nickname: varchar('nickname', { length: 50 }).notNull().unique(),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
