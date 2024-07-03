import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import { bookmarkSchema } from './bookmarks.schemas';
import { toggleBookmark, getBookmarks } from './bookmarks.controllers';

export const bookmarksRouter = Router();

bookmarksRouter
  .get('/', getBookmarks)
  .post('/', validateBody(bookmarkSchema), toggleBookmark);
