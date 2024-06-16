import z from 'zod';
import { deleteFilesSchema } from './files.schemas';

export type DeleteFilesDto = z.infer<typeof deleteFilesSchema>;
