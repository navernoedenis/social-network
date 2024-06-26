import { ZodError } from 'zod';

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  if (error instanceof ZodError) {
    return error.errors[0].message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};
