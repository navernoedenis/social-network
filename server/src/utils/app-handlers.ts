import { httpStatus } from '@/utils/constants';
import {
  type HttpError,
  type HttpResponse,
  type NextFunction,
  type Request,
  type Response,
} from '@/types/main';

class AppHandlers {
  test(req: Request, res: Response) {
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      data: null,
      message: 'Test works! :)',
    } as HttpResponse);
  }

  notFound(req: Request, res: Response) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      error: 'The endpoint you have tried to access does not exist',
    } as HttpResponse);
  }

  httpError(
    error: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) {
    const statusCode = error.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      success: false,
      statusCode,
      error: error.message,
    } as HttpResponse);
  }
}

export const appHandlers = new AppHandlers();
