import { type User } from '@/db/files/models';

export type FindKey = keyof Pick<User, 'id' | 'email' | 'username'>;
export type UpdateFields = Partial<Omit<User, 'id' | 'role'>>;

export type WithConfig = {
  withProfile?: boolean;
  withSettings?: boolean;
};
