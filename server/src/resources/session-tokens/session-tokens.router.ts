import { Router } from 'express';
import { checkCookieToken } from '@/utils/middlewares';
import {
  getMySessionTokens,
  revokeSessionToken,
  revokeSessionTokens,
} from './session-tokens.controllers';

export const sessionTokensRouter = Router();

sessionTokensRouter
  .get('/', getMySessionTokens)
  .delete('/all', checkCookieToken, revokeSessionTokens)
  .delete('/:id', revokeSessionToken);
