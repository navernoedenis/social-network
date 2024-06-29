import z from 'zod';
import { mediaTypes } from '@/utils/constants';

export const createPostSchema = z.object({
  body: z.string().trim().max(2000, 'maximum 2000 leters'),
  files: z.array(
    z.object({
      id: z.number(),
      userId: z.number(),
      bucketKey: z.string().min(1),
      name: z.string().min(1),
      url: z.string().url(),
      type: z.enum(mediaTypes),
    })
  ),
});

export const createCommentSchema = z.object({
  parentId: z.number().nullable(),
  message: z.string().trim().min(1, 'At least one symbol'),
});

export const createLikeSchema = z.object({
  value: z.enum(['1', '-1']).transform((v) => parseInt(v)),
});

export const updateCommentSchema = z.object({
  message: z.string().trim().min(1),
});
