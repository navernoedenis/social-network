import { integer, uuid, pgTable, index, varchar } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema';

export const passwords = pgTable(
  'passwords',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    hash: varchar('hash', { length: 150 }).notNull(),
  },
  (table) => ({
    userIdx: index('passwords_user_idx').on(table.userId),
  })
);
