import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users, messages } from '@/db/files/entities';

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    author: one(users, {
      fields: [conversations.authorId],
      references: [users.id],
    }),
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    message: many(conversationsMessages),
  })
);

// CONVERSATIONS MESSAGES

export const conversationsMessages = pgTable(
  'conversations_messages',
  {
    conversationId: integer('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    messageId: integer('message_id')
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.conversationId, table.messageId] }),
  })
);

export const conversationsMessagesRelations = relations(
  conversationsMessages,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationsMessages.conversationId],
      references: [conversations.id],
    }),
    message: one(messages, {
      fields: [conversationsMessages.messageId],
      references: [messages.id],
    }),
  })
);
