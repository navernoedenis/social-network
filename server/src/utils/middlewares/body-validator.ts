import { type ZodSchema } from 'zod';
import { type Request, type Response, type NextFunction } from '@/types/main';
import { BadRequest } from '@/utils/helpers';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = await schema.safeParseAsync(req.body);

      if (error) {
        throw new BadRequest(error.errors[0].message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
