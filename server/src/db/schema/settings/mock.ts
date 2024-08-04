import { type NewSetting } from './model';

export const createSettings = (
  userId: number,
  is2faEnabled = false
): NewSetting => ({
  userId,
  is2faEnabled,
});
