import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '@/db/schema';

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    browser: varchar('browser', { length: 15 }).notNull(),
    os: varchar('os', { length: 15 }).notNull(),
    ip: varchar('ip', { length: 30 }).notNull(),
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('refresh_tokens_user_idx').on(table.userId),
  })
);
