import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';
import { bookmarkSchema } from './bookmarks.schemas';
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from './bookmarks.controllers';

export const bookmarksRouter = Router();

bookmarksRouter
  .get('/', getBookmarks)
  .post('/', validateBody(bookmarkSchema), createBookmark)
  .delete('/', validateBody(bookmarkSchema), deleteBookmark);
