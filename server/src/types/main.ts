export { type Request, type Response, type NextFunction } from 'express';

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
