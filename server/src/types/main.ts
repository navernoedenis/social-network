export { type Request, type Response, type NextFunction } from 'express';
import { type File } from 'formidable';

import { mediaTypes } from '@/utils/constants/files';

export type ENV_MODE = 'development' | 'production';
export type Role = 'user' | 'admin' | 'root';

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
};

export type HttpResponse = { statusCode: number } & (
  | { success: true; message: string; data: unknown; error?: never }
  | { success: false; message?: never; data?: never; error: string }
);

export type HttpError = {
  statusCode: number;
  message: string;
};

export type ExecutionResult<T> = Promise<
  { data: T; error?: never } | { data?: never; error: string }
>;

export type MediaType = (typeof mediaTypes)[number];
export type MediaFile = File;
