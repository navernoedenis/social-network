import { relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import {
  passwords,
  posts,
  profiles,
  sessionTokens,
  settings,
} from '@/db/files/entities';

const roles = ['user', 'admin', 'root'] as const;

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 50 }).notNull().unique(),
    username: varchar('username', { length: 30 }).unique(),
    photo: text('photo'),
    firstname: varchar('firstname', { length: 50 }),
    lastname: varchar('lastname', { length: 50 }),
    role: text('role', { enum: roles }).notNull().default('user'),
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
  posts: many(posts),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  settings: one(settings, {
    fields: [users.id],
    references: [settings.userId],
  }),
  tokens: many(sessionTokens),
}));
