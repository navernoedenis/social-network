import z from 'zod';

export const createConversationSchema = z.object({
  userId: z.number().positive(),
});

export const openConversationSchema = z.object({
  id: z.number().positive(),
});
