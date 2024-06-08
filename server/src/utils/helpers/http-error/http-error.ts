import { httpStatus } from '@/utils/constants';
import { type HttpError as IHttpError } from '@/types/main';

abstract class HttpError extends Error implements IHttpError {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
  }
}

export class BadRequest extends HttpError {
  statusCode = httpStatus.BAD_REQUEST;
}

export class Unauthorized extends HttpError {
  statusCode = httpStatus.UNAUTHORIZED;
}

export class Forbidden extends HttpError {
  statusCode = httpStatus.FORBIDDEN;
}

export class NotFound extends HttpError {
  statusCode = httpStatus.NOT_FOUND;
}

export class Conflict extends HttpError {
  statusCode = httpStatus.CONFLICT;
}

export class InternalServerError extends HttpError {
  statusCode = httpStatus.INTERNAL_SERVER_ERROR;
}
