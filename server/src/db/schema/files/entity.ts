import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';
import { mediaTypes } from '@/utils/constants';

export const files = pgTable(
  'files',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    bucketKey: varchar('bucket_key', { length: 80 }).notNull(),
    name: text('name').notNull(),
    url: varchar('url', { length: 150 }).notNull(),
    type: text('type', { enum: mediaTypes }).notNull(),
  },
  (table) => ({
    userIdx: index('files_user_id_idx').on(table.userId),
  })
);

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));
