import { likes } from './entity';

export type NewLike = typeof likes.$inferInsert;
export type Like = typeof likes.$inferSelect;
