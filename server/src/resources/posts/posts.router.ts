import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';

import { createPostSchema } from './posts.schemas';
import { createPost } from './posts.controllers';

export const postsRouter = Router();

postsRouter.post('/', validateBody(createPostSchema), createPost);
