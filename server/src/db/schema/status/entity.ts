import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  timestamp,
} from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';

export const status = pgTable(
  'status',
  {
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    isOnline: boolean('is_online'),
    lastOnline: timestamp('last_online', { mode: 'date' }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId] }),
  })
);

export const statusRelations = relations(status, ({ one }) => ({
  user: one(users, {
    fields: [status.userId],
    references: [users.id],
  }),
}));
