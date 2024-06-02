import { faker } from '@faker-js/faker';
import { type NewUser } from './model';

export const createUser = (): NewUser => ({
  email: faker.internet.email(),
  username: faker.helpers.arrayElement([faker.internet.userName(), null]),
  photo: faker.helpers.arrayElement([faker.image.avatar(), null]),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  role: 'user',
});
