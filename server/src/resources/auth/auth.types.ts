import { z } from 'zod';
import { loginSchema, signUpSchema } from './auth.schemas';

export type LoginDto = z.infer<typeof loginSchema>;
export type SignUpDto = z.infer<typeof signUpSchema>;
