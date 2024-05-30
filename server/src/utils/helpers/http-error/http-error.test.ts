import { BadRequest, Unauthorized, Forbidden, NotFound } from './http-error';

describe('test class http-errors', () => {
  test('bad request: statusCode 400 and message', () => {
    const message = 'Horse';
    const error = new BadRequest(message);
    expect(error).toMatchObject({ statusCode: 400, message });
  });

  test('unauthorized: statusCode 401 and message', () => {
    const message = 'Duck';
    const error = new Unauthorized(message);
    expect(error).toMatchObject({ statusCode: 401, message });
  });

  test('forbidden: statusCode 403 and message', () => {
    const message = 'Lion';
    const error = new Forbidden(message);
    expect(error).toMatchObject({ statusCode: 403, message });
  });

  test('not found: statusCode 404 and message', () => {
    const message = 'Whale';
    const error = new NotFound(message);
    expect(error).toMatchObject({ statusCode: 404, message });
  });
});
