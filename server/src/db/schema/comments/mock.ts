import { faker } from '@faker-js/faker';
import { type NewComment } from './model';

export const createComment = (data: {
  userId: number;
  parentId?: number | null;
}): NewComment => ({
  parentId: data.parentId ? data.parentId : null,
  userId: data.userId,
  message: faker.lorem.text(),
});
