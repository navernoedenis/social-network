import { faker } from '@faker-js/faker';
import { type NewUser } from './model';

export const createUser = (): NewUser => {
  const firstname = faker.helpers.arrayElement([
    faker.person.firstName(),
    null,
  ]);

  return {
    email: faker.internet.email().toLowerCase(),
    username: faker.internet.userName().toLowerCase(),
    photo: faker.helpers.arrayElement([faker.image.avatar(), null]),
    firstname,
    lastname: firstname ? faker.person.lastName() : null,
    role: faker.helpers.arrayElement(['admin', 'user', 'user', 'user']),
    lastOnline: faker.helpers.arrayElement([
      null,
      faker.date.between({
        from: '2023-01-01T00:00:00.000Z',
        to: '2024-01-01T00:00:00.000Z',
      }),
    ]),
  };
};
