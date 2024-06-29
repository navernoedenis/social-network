import { Router } from 'express';
import { validateBody } from '@/utils/middlewares';

import { deleteFiles, uploadFiles } from './files.controllers';
import { deleteFilesSchema } from './files.schemas';

export const filesRouter = Router();

const validators = {
  deleteFiles: [validateBody(deleteFilesSchema)],
};

filesRouter
  .post('/', uploadFiles)
  .delete('/', validators.deleteFiles, deleteFiles);
