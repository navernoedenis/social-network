import { Router } from 'express';
import { checkUser, checkUserId } from '@/utils/middlewares';
import { checkFriend } from './friends.middlewares';
import {
  approveFriendRequest,
  createFriendRequest,
  deleteFriend,
  getFriends,
  getFriendsCount,
  getIncomingRequests,
  getOutgoingRequests,
} from './friends.controllers';

export const friendsRouter = Router();

friendsRouter
  .get('/', getFriends)
  .delete(
    '/:id',
    checkUserId,
    checkUser,
    checkFriend({
      notFoundError: true,
      skipPending: true,
      skipApproved: true,
    }),
    deleteFriend
  )
  .get('/count', getFriendsCount)
  .post(
    '/:id/approve',
    checkUserId,
    checkUser,
    checkFriend({
      notFoundError: true,
      skipPending: true,
    }),
    approveFriendRequest
  )
  .post(
    '/:id/request',
    checkUserId,
    checkUser,
    checkFriend(),
    createFriendRequest
  )
  .get('/requests/incoming', getIncomingRequests)
  .get('/requests/outgoing', getOutgoingRequests);
