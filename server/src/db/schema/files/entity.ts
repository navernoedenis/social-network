import {
  index,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '@/db/files/entities';
import { mediaTypes } from '@/utils/constants';

export const files = pgTable(
  'files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    bucketKey: varchar('bucket_key', { length: 80 }).notNull(),
    name: text('name').notNull(),
    url: varchar('url', { length: 150 }).notNull(),
    type: text('type', { enum: mediaTypes }).notNull(),
  },
  (table) => ({
    authorIdx: index('files_author_idx').on(table.authorId),
  })
);
