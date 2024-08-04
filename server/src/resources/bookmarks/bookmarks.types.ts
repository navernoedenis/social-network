import z from 'zod';
import { NewBookmark } from '@/db/files/models';
import { bookmarkSchema } from './bookmarks.schemas';

export type BookmarkDto = z.infer<typeof bookmarkSchema>;
export type BookmarkData = Omit<NewBookmark, 'createdAt'>;

export type BookmarksParams = {
  userId: number;
  page: number;
  limit: number;
};
