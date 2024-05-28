import { ZodError } from 'zod';

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof ZodError) {
    return error.errors[0].message;
  }

  return 'Unknown error';
};
