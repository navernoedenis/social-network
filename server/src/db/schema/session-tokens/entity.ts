import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';

export const sessionTokens = pgTable(
  'session_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    browser: varchar('browser', { length: 50 }).notNull(),
    os: varchar('os', { length: 20 }).notNull(),
    ip: varchar('ip', { length: 30 }).notNull(),
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('session_tokens_user_id_idx').on(table.userId),
  })
);

export const sessionTokensRelations = relations(sessionTokens, ({ one }) => ({
  user: one(users, {
    fields: [sessionTokens.userId],
    references: [users.id],
  }),
}));
