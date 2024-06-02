import { faker } from '@faker-js/faker';
import { type NewProfile } from './model';

export const createProfile = (userId: number): NewProfile => ({
  userId,
  isOfficial: faker.helpers.arrayElement([true, false]),
  isVerified: faker.helpers.arrayElement([true, false]),
  about: faker.helpers.arrayElement([faker.person.bio(), null]),
});
