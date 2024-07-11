import { Router } from 'express';
import { checkCookieToken } from '@/utils/middlewares';
import {
  getSessionTokens,
  revokeSessionToken,
  revokeSessionTokens,
} from './session-tokens.controllers';

export const sessionTokensRouter = Router();

sessionTokensRouter
  .get('/', getSessionTokens)
  .delete('/', checkCookieToken, revokeSessionTokens)
  .delete('/:id', revokeSessionToken);
