import { faker } from '@faker-js/faker';
import { type NewProfile } from './model';

export const createProfile = (userId: number): NewProfile => ({
  userId,
  isActive: faker.helpers.arrayElement([true, false]),
  isOfficial: faker.helpers.arrayElement([true, false]),
  isEmailVerified: false,
  isPhoneVerified: false,
  about: faker.helpers.arrayElement([faker.person.bio(), null]),
});
