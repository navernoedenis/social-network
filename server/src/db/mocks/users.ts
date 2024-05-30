import { faker } from '@faker-js/faker';
import { type NewUser } from '../schema';

export function createUser(): NewUser {
  return {
    email: faker.internet.email(),
    nickname: faker.internet.userName(),
  };
}

export const users: NewUser[] = faker.helpers.multiple(createUser, {
  count: 10,
});
