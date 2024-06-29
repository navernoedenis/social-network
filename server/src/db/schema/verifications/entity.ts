import { relations } from 'drizzle-orm';
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

const types = ['2fa', 'email', 'forgot-password', 'phone'] as const;

export const verifications = pgTable(
  'verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type', { enum: types }).notNull(),
    payload: varchar('payload', { length: 255 }).notNull(),
    expiredAt: timestamp('expired_at', { mode: 'date' }).notNull(),
  },
  (table) => ({
    userIdx: index('verifications_user_id_idx').on(table.userId),
  })
);

export const verificationsRelations = relations(verifications, ({ one }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
}));
