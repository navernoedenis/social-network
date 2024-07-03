import { type ZodSchema } from 'zod';
import { type Request, type Response, type NextFunction } from '@/types/main';
import { BadRequest } from '@/utils/helpers';

import { capitalize } from '@/utils/helpers';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hasBody = !!Object.keys(req.body).length;
      if (!hasBody) {
        throw new BadRequest("Body can't be empty");
      }

      const result = await schema.safeParseAsync(req.body);

      if (result.error) {
        const { message, path } = result.error.errors[0];

        let errorMessage = message;
        if (message === 'Required') {
          const field = capitalize(`${path[0]}`);
          errorMessage = `${field} is required`;
        }

        throw new BadRequest(errorMessage);
      }

      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
