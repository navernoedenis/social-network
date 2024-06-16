import { files } from './entity';

export type NewFile = typeof files.$inferInsert;
export type File = typeof files.$inferSelect;
