import { boolean, serial, pgTable, integer, index } from 'drizzle-orm/pg-core';
import { users } from '@/db/files/entities';

export const settings = pgTable(
  'settings',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    is2faEnabled: boolean('is_2fa_enabled').notNull().default(false),
  },
  (table) => ({
    userIdx: index('settings_user_idx').on(table.userId),
  })
);
