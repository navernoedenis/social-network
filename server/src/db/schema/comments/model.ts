import { comments } from './entity';

export type NewComment = typeof comments.$inferInsert;
export type Comment = typeof comments.$inferSelect;
