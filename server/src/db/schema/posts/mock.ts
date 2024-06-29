import { faker } from '@faker-js/faker';
import { type NewPost } from './model';

export const createPost = (userId: number): NewPost => ({
  userId,
  body: faker.lorem.text(),
});
