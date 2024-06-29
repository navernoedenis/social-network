import { relations } from 'drizzle-orm';
import { boolean, serial, pgTable, integer, index } from 'drizzle-orm/pg-core';
import { users } from '@/db/files/entities';

export const settings = pgTable(
  'settings',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    is2faEnabled: boolean('is_2fa_enabled').notNull().default(false),
  },
  (table) => ({
    userIdx: index('settings_user_id_idx').on(table.userId),
  })
);

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}));
