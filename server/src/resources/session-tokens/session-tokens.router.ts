import { Router } from 'express';
import { checkCookieToken } from '@/utils/middlewares';
import {
  getSessionTokens,
  deleteSessionToken,
  deleteSessionTokens,
} from './session-tokens.controllers';

export const sessionTokensRouter = Router();

sessionTokensRouter
  .get('/', getSessionTokens)
  .delete('/', checkCookieToken, deleteSessionTokens)
  .delete('/:token', deleteSessionToken);
