import { faker } from '@faker-js/faker';
import { type NewUser } from './model';

export const createUser = (): NewUser => {
  const firstname = faker.helpers.arrayElement([
    faker.person.firstName(),
    null,
  ]);

  const username = faker.internet.userName().toLowerCase();

  return {
    email: faker.internet.email().toLowerCase(),
    username: faker.helpers.arrayElement([username, null]),
    photo: faker.helpers.arrayElement([faker.image.avatar(), null]),
    firstname,
    lastname: firstname ? faker.person.lastName() : null,
    role: faker.helpers.arrayElement(['admin', 'user', 'user', 'user']),
  };
};
