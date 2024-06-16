import { faker } from '@faker-js/faker';
import { type NewPost } from './model';

export const createPost = (authorId: number): NewPost => ({
  authorId,
  body: faker.lorem.text(),
});
