import { Router } from 'express';
import { checkUser, checkUserId } from '@/utils/middlewares';
import { checkFriend } from './friends.middlewares';
import {
  approveFriend,
  createFriend,
  deleteFriend,
  getFriends,
  getMyRequests,
  getRequests,
} from './friends.controllers';

export const friendsRouter = Router();

friendsRouter
  .get('/', getFriends)
  .post('/:id', checkUserId, checkUser, checkFriend(), createFriend)
  .delete(
    '/:id',
    checkUserId,
    checkUser,
    checkFriend({ notFoundError: true, skipPending: true }),
    deleteFriend
  )
  .post(
    '/:id/approve',
    checkUserId,
    checkUser,
    checkFriend({ notFoundError: true, skipPending: true }),
    approveFriend
  )
  .get('/requests', getRequests)
  .get('/requests/my', getMyRequests);
