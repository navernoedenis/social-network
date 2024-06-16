import { posts } from './entity';

export type NewPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;
