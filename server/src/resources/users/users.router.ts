import { Router } from 'express';
import { deleteMyAccount } from './users.controllers';

export const usersRouter = Router();

usersRouter.delete('/me', deleteMyAccount);
