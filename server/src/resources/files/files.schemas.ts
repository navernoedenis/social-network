import z from 'zod';

export const deleteFilesSchema = z.object({
  fileIds: z.array(z.number()),
});
