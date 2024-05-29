import { getErrorMessage } from './error-message';
import { z } from 'zod';

describe('test getErrorMessage', () => {
  test('default error', () => {
    const message = 'Typo error';
    const error = new Error(message);
    expect(getErrorMessage(error)).toBe(message);
  });

  test('zod error', () => {
    const message = 'Oh no!';
    const zodError = new z.ZodError([
      {
        code: 'invalid_string',
        message,
        path: [],
        validation: 'base64',
      },
    ]);
    expect(getErrorMessage(zodError)).toBe(message);
  });

  test('unknown error', () => {
    [[], {}, null, undefined, '', 5, true, false].forEach((value) => {
      expect(getErrorMessage(value)).toBe('Unknown error');
    });
  });
});
