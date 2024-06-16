import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { comments, files, likes, users } from '@/db/files/entities';

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),

    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    authorIdx: index('posts_author_idx').on(table.authorId),
  })
);

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
  files: many(files),
  likes: many(likes),
}));
