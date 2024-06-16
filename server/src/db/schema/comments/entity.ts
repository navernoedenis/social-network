import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { users, likes } from '@/db/files/entities';

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    message: text('message').notNull(),

    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    authorIdx: index('comments_author_idx').on(table.authorId),
  })
);

export const commentsRelations = relations(comments, ({ many }) => ({
  comments: many(comments),
  likes: many(likes),
}));
