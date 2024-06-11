import { type Request } from 'express';

export const createLink = (req: Request, config: { path: string }): string => {
  return `${req.protocol}://${req.headers.host}${config.path}`;
};
