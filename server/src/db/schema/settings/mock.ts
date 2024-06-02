import { faker } from '@faker-js/faker';
import { type NewSetting } from './model';

export const createSettings = (userId: number): NewSetting => ({
  userId,
  is2faEnabled: faker.helpers.arrayElement([true, false]),
});
