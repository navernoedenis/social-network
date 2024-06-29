import { faker } from '@faker-js/faker';
import { type NewComment } from './model';

export const createComment = (data: {
  postId: number;
  userId: number;
  parentId?: number;
}): NewComment => ({
  userId: data.userId,
  message: faker.lorem.text(),
  parentId: data.parentId ?? null,
});
