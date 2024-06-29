import { posts, postsFiles, postsLikes, postsComments } from './entity';

export type NewPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;

export type PostComment = typeof postsComments.$inferSelect;
export type PostFile = typeof postsFiles.$inferSelect;
export type PostLike = typeof postsLikes.$inferSelect;
