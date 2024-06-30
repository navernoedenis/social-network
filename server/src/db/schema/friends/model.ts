import { friends } from './entity';

export type NewFriend = typeof friends.$inferInsert;
export type Friend = typeof friends.$inferSelect;
export type FriendStatus = NewFriend['status'];
