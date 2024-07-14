import z from 'zod';

export const createConversationSchema = z.object({
  userId: z.number().positive(),
});
