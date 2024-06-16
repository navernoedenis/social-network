import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';

import { deleteFiles, uploadFiles } from './files.controllers';
import { deleteFilesSchema } from './files.schemas';

export const filesRouter = Router();

filesRouter
  .post('/', uploadFiles)
  .delete('/', validateBody(deleteFilesSchema), deleteFiles);
