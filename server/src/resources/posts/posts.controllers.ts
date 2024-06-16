import {
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

import { httpStatus } from '@/utils/constants';

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'Post has been created ✉️',
    } as HttpResponse);
  } catch (error) {
    next(error);
  }
};
