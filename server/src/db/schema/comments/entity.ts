import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { users, likes } from '@/db/files/entities';

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    parentId: integer('parent_id'),
    message: text('message').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('comments_user_id_idx').on(table.userId),
  })
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comments',
  }),
  comments: many(comments, {
    relationName: 'comments',
  }),
  likes: many(commentsLikes),
}));

export const commentsLikes = pgTable(
  'comments_likes',
  {
    commentId: integer('comment_id')
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    likeId: integer('like_id')
      .references(() => likes.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.commentId, table.userId, table.likeId],
    }),
  })
);

export const commentsLikesRelations = relations(commentsLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentsLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentsLikes.userId],
    references: [users.id],
  }),
  like: one(likes, {
    fields: [commentsLikes.likeId],
    references: [likes.id],
  }),
}));
