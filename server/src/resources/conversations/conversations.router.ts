import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';

import { createConversationSchema } from './conversations.schemas';
import { checkCreation, checkDeleting } from './conversations.middlewares';
import {
  createConversation,
  deleteConversation,
  getConversations,
} from './conversations.controllers';

export const conversationsRouter = Router();

conversationsRouter
  .get('/', getConversations)
  .post(
    '/',
    validateBody(createConversationSchema),
    checkCreation,
    createConversation
  )
  .delete('/:id', checkDeleting, deleteConversation);
