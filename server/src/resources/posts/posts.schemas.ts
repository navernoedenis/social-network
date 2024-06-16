import z from 'zod';

export const createPostSchema = z.object({
  text: z
    .string()
    .trim()
    .min(2, 'minimum message must be at least 2 letters')
    .max(2000, 'maximum 2000 leters'),
  // files: z.array(z.string().url()),
});
