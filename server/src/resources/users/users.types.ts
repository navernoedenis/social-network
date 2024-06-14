import { type User } from '@/db/files/models';

export type WithConfig = {
  withProfile?: boolean;
  withSettings?: boolean;
};

export type FindKey = keyof Pick<User, 'id' | 'email' | 'username'>;
export type UpdateFields = Partial<Omit<User, 'id' | 'role'>>;
