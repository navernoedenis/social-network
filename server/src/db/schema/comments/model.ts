import { comments, commentsLikes } from './entity';

export type NewComment = typeof comments.$inferInsert;
export type Comment = typeof comments.$inferSelect;

export type NewCommentLike = typeof commentsLikes.$inferInsert;
export type CommentLike = typeof commentsLikes.$inferSelect;
