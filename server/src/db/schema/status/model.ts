import { status } from './entity';

export type NewStatus = typeof status.$inferInsert;
export type Status = typeof status.$inferSelect;
