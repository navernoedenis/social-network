import { users } from '@/db/files/entities';
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    about: varchar('about', { length: 200 }).notNull().default(''),
    birthday: date('birthday', { mode: 'date' }),
    phone: varchar('phone', { length: 40 }),

    isActive: boolean('is_active').notNull().default(true),
    isOfficial: boolean('is_official').notNull().default(false),
    isEmailVerified: boolean('is_email_verified').notNull().default(false),
    isPhoneVerified: boolean('is_phone_verified').notNull().default(false),

    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdx: index('profiles_user_idx').on(table.userId),
  })
);
