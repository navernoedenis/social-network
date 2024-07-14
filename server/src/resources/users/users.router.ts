import { Router } from 'express';
import { deleteUser, getUsers } from './users.controllers';

export const usersRouter = Router();

usersRouter.get('/', getUsers).delete('/me', deleteUser);
