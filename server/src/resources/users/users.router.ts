import { Router } from 'express';
import { deleteUser, searchUsers } from './users.controllers';

export const usersRouter = Router();

usersRouter.get('/', searchUsers).delete('/me', deleteUser);
