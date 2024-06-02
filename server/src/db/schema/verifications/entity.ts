import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '@/db/schema';

export const emailVerifications = pgTable(
  'email_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    email: varchar('email', { length: 50 }).notNull().unique(),
    token: varchar('token', { length: 255 }).notNull(),
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('email_verifications_user_id').on(table.userId),
    emailIdx: index('email_verifications_email_idx').on(table.email),
  })
);

export const twoFactorVerifications = pgTable(
  'two_factor_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    otp: varchar('otp', { length: 6 }).notNull(),
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('two_factor_verifications_user_idx').on(table.userId),
  })
);
