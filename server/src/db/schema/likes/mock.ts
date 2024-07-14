import { faker } from '@faker-js/faker';
import { type NewLike } from './model';

export const createLike = (): NewLike => ({
  value: faker.helpers.arrayElement([1, -1]),
});
