import { Router } from 'express';
import { checkUser, checkUserId } from '@/utils/middlewares';
import {
  toggleSubscription,
  getSubscriptionsCount,
} from './subscriptions.controllers';

export const subscriptionsRouter = Router();

subscriptionsRouter
  .post('/:id', checkUserId, checkUser, toggleSubscription)
  .get('/:id/count', checkUser, getSubscriptionsCount);
