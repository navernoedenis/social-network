import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';
import { notificationTypes } from '@/utils/constants';

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  type: text('type', { enum: notificationTypes }).notNull(),
  message: varchar('message', { length: 255 }).notNull(),

  senderId: integer('sender_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  recepientId: integer('recepient_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  sender: one(users, {
    fields: [notifications.senderId],
    references: [users.id],
  }),
  recepient: one(users, {
    fields: [notifications.recepientId],
    references: [users.id],
  }),
}));
