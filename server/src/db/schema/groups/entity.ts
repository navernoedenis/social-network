import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users, messages } from '@/db/files/entities';

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
  author: one(users, {
    fields: [groups.authorId],
    references: [users.id],
  }),
  users: many(groupsUsers),
  messages: many(groupsMessages),
}));

// GROUPS USERS

export const groupsUsers = pgTable(
  'groups_users',
  {
    groupId: integer('group_id')
      .references(() => groups.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.userId] }),
  })
);

export const groupsUsersRelations = relations(groupsUsers, ({ one }) => ({
  user: one(users, {
    fields: [groupsUsers.userId],
    references: [users.id],
  }),
}));

// GROUPS MESSAGES

export const groupsMessages = pgTable(
  'groups_messages',
  {
    groupId: integer('group_id')
      .references(() => groups.id)
      .notNull(),
    messageId: integer('message_id')
      .references(() => messages.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.messageId] }),
  })
);

export const groupsMessagesRelations = relations(groupsMessages, ({ one }) => ({
  message: one(messages, {
    fields: [groupsMessages.messageId],
    references: [messages.id],
  }),
}));
