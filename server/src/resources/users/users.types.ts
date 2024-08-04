import { type User, type Profile, type Setting } from '@/db/files/models';

export type UpdateFields = Partial<Omit<User, 'id' | 'role'>>;

export type UserData = User & {
  profile: Profile;
  settings: Setting;
};
