import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';

const types = ['email', 'forgot-password', '2fa'] as const;

export const verifications = pgTable(
  'verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    type: text('type', { enum: types }).notNull(),
    payload: varchar('payload', { length: 255 }).notNull(), // token, otp password
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('verifications_user_id').on(table.userId),
  })
);
