import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from '@/db/files/entities';
import { friendStatuses } from '@/utils/constants';

export const friends = pgTable('friends', {
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  friendId: integer('friend_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: text('status', { enum: friendStatuses }).notNull(),
});

export const friendsRelations = relations(friends, ({ one }) => ({
  user: one(users, {
    fields: [friends.userId],
    references: [users.id],
  }),
  friend: one(users, {
    fields: [friends.friendId],
    references: [users.id],
  }),
}));
