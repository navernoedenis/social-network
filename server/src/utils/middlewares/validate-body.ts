import { type ZodSchema } from 'zod';
import { type Request, type Response, type NextFunction } from '@/types/main';
import { BadRequest } from '@/utils/helpers';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hasBody = !!Object.keys(req.body).length;
      if (!hasBody) {
        throw new BadRequest("Body can't be empty");
      }

      const result = await schema.safeParseAsync(req.body);
      if (result.error) {
        throw new BadRequest(result.error.errors[0].message);
      }

      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
