import { groups } from './entity';

export type NewGroup = typeof groups.$inferInsert;
export type Group = typeof groups.$inferSelect;
