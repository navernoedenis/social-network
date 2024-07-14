import { faker } from '@faker-js/faker';
import { type NewMessage } from './model';

export const createMessage = (authorId: number): NewMessage => ({
  authorId,
  body: faker.lorem.sentence(),
});
