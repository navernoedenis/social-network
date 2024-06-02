import { settings } from './entity';

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
