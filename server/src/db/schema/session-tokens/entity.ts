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
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    browser: varchar('browser', { length: 50 }).notNull(),
    os: varchar('os', { length: 20 }).notNull(),
    ip: varchar('ip', { length: 30 }).notNull(),
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('session_tokens_user_idx').on(table.userId),
    tokenIdx: index('session_tokens_token_idx').on(table.token),
  })
);
