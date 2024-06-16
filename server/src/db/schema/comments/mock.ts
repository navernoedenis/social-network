import { faker } from '@faker-js/faker';
import { type NewComment } from './model';

export const createComment = (authorId: number): NewComment => ({
  authorId,
  message: faker.lorem.text(),
});
