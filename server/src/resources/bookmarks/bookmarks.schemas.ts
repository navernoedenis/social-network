import z from 'zod';
import { bookmarkTypes } from '@/utils/constants';

export const bookmarkSchema = z.object({
  entity: z.enum(bookmarkTypes),
  entityId: z.number().positive(),
});
