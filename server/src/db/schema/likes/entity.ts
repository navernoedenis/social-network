import {
  index,
  integer,
  pgTable,
  text,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from '@/db/files/entities';

const entities = ['post', 'comment', 'message'] as const;

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    entitiyId: varchar('entity_id', { length: 40 }).notNull(),
    entity: text('type', { enum: entities }).notNull(),
  },
  (table) => ({
    likesEntity: unique('likes_entity_entityid_idx').on(
      table.entity,
      table.entitiyId
    ),
    likesAuthorIdx: index('likes_author_idx').on(table.authorId),
  })
);
