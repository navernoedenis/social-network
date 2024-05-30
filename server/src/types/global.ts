export { type Request, type Response, type NextFunction } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export type HttpResponse = { statusCode: number } & (
  | { success: true; message: string; data: unknown; error?: never }
  | { success: false; message?: never; data?: never; error: string }
);

export interface HttpError {
  statusCode: number;
  message: string;
}
