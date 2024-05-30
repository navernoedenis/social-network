import { httpStatus } from '@/utils/constants/http-status';
import {
  type HttpError,
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/global';

export class AppHandlers {
  static testHandler = (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
      data: null,
      message: 'Test works! :)',
      statusCode: httpStatus.OK,
      success: true,
    } as HttpResponse);
  };

  static notFoundtHandler = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
      error: 'The endpoint you have tried to access does not exist',
      statusCode: httpStatus.NOT_FOUND,
      success: false,
    } as HttpResponse);
  };

  static httpErrorHandler = (
    error: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
      success: false,
    } as HttpResponse);
  };
}
