import z from 'zod';

export const deleteFilesSchema = z.object({
  fileIds: z.array(z.string()).min(1, 'Must be one id at least'),
});
