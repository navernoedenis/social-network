import { pgTable, serial, smallint } from 'drizzle-orm/pg-core';

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  value: smallint('value').notNull(), // like = 1, dislike = -1
});
