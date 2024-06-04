import { faker } from '@faker-js/faker';
import { type NewUser } from './model';

export const createUser = (): NewUser => ({
  email: faker.internet.email(),
  username: faker.helpers.arrayElement([faker.internet.userName(), null]),
  photo: faker.helpers.arrayElement([faker.image.avatar(), null]),
  firstname: faker.helpers.arrayElement([faker.person.firstName(), null]),
  lastname: faker.helpers.arrayElement([faker.person.lastName(), null]),
  role: 'user',
});
