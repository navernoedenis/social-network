import { sql } from 'drizzle-orm';
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
import { users } from '@/db/schema';

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    about: varchar('about', { length: 200 }),
    birthday: date('birthday', { mode: 'date' }),

    isOfficial: boolean('is_official').default(false),
    isVerified: boolean('is_verified').default(false),

    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
      () => sql`CURRENT_TIMESTAMP`
    ),
  },
  (table) => ({
    userIdx: index('profiles_user_idx').on(table.userId),
  })
);
