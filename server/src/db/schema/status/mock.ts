import { faker } from '@faker-js/faker';
import { type NewStatus } from './model';

export const createStatus = (userId: number): NewStatus => {
  const lastOnline = faker.helpers.arrayElement([new Date(), null]);
  const isOnline = lastOnline
    ? faker.helpers.arrayElement([true, false])
    : null;

  return {
    isOnline,
    lastOnline,
    userId,
  };
};
