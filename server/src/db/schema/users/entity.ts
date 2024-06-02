import {
  pgTable,
  serial,
  text,
  varchar,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { passwords, profiles, refreshTokens, settings } from '@/db/schema';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 50 }).notNull().unique(),
    username: varchar('username', { length: 50 }),
    photo: text('photo'),
    firstname: varchar('firstname', { length: 50 }),
    lastname: varchar('lastname', { length: 50 }),
    role: text('role', { enum: ['user', 'admin', 'root'] }).default('user'),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    usernameIdx: index('users_username_idx').on(table.username),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  password: one(passwords, {
    fields: [users.id],
    references: [passwords.userId],
  }),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  settings: one(settings, {
    fields: [users.id],
    references: [settings.userId],
  }),
  tokens: many(refreshTokens),
}));
