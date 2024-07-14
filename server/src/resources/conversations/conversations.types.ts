import z from 'zod';
import { createConversationSchema } from './conversations.schemas';

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
