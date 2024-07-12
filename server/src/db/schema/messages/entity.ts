import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { files, users } from '@/db/files/entities';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),

  body: text('message').notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const messagesRelations = relations(messages, ({ one, many }) => ({
  author: one(users, {
    fields: [messages.authorId],
    references: [users.id],
  }),
  files: many(messagesFiles),
}));

// MESSAGES FILES

export const messagesFiles = pgTable(
  'message_files',
  {
    messageId: integer('message_id')
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
    fileId: integer('file_id')
      .references(() => files.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.messageId, table.fileId] }),
  })
);

export const messagesFilesRelations = relations(messagesFiles, ({ one }) => ({
  message: one(messages, {
    fields: [messagesFiles.messageId],
    references: [messages.id],
  }),
  file: one(files, {
    fields: [messagesFiles.fileId],
    references: [files.id],
  }),
}));
