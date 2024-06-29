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

import { comments, files, likes, users } from '@/db/files/entities';

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('posts_user_id_idx').on(table.userId),
  })
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(postsComments),
  files: many(postsFiles),
  likes: many(postsLikes),
}));

// POSTS COMMENTS

export const postsComments = pgTable(
  'posts_comments',
  {
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    commentId: integer('comment_id')
      .references(() => comments.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.commentId] }),
  })
);

export const postsCommentsRelations = relations(postsComments, ({ one }) => ({
  post: one(posts, {
    fields: [postsComments.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [postsComments.commentId],
    references: [comments.id],
  }),
}));

// POSTS FILES

export const postsFiles = pgTable(
  'posts_files',
  {
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    fileId: integer('file_id')
      .references(() => files.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.fileId] }),
  })
);

export const postsFilesRelations = relations(postsFiles, ({ one }) => ({
  post: one(posts, {
    fields: [postsFiles.postId],
    references: [posts.id],
  }),
  file: one(files, {
    fields: [postsFiles.fileId],
    references: [files.id],
  }),
}));

// POSTS LIKES

export const postsLikes = pgTable(
  'posts_likes',
  {
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    likeId: integer('like_id')
      .references(() => likes.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.userId, table.likeId] }),
  })
);

export const postsLikesRelations = relations(postsLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postsLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postsLikes.userId],
    references: [users.id],
  }),
  like: one(likes, {
    fields: [postsLikes.likeId],
    references: [likes.id],
  }),
}));
