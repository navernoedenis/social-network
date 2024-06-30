import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';

export const subscriptions = pgTable(
  'subscriptions',
  {
    subscriberId: integer('subscriber_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    subscribedToId: integer('subscribed_to_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.subscriberId, table.subscribedToId] }),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  subscriber: one(users, {
    fields: [subscriptions.subscriberId],
    references: [users.id],
  }),
  subscribedTo: one(users, {
    fields: [subscriptions.subscribedToId],
    references: [users.id],
  }),
}));
