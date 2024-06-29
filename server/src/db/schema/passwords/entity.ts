import { relations } from 'drizzle-orm';
import { integer, uuid, pgTable, index, varchar } from 'drizzle-orm/pg-core';
import { users } from '@/db/files/entities';

export const passwords = pgTable(
  'passwords',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    hash: varchar('hash', { length: 150 }).notNull(),
  },
  (table) => ({
    userIdx: index('passwords_user_id_idx').on(table.userId),
  })
);

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.id],
    references: [users.id],
  }),
}));
