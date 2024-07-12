export const authCookie = {
  forgotPasswordToken: 'forgot-password-token',
  refreshToken: 'refreshToken',
  twoFA: '2fa',
} as const;

export const BYTES_IN = {
  kb: 1024,
  mb: 1_048_576,
} as const;

export const MILLISECONDS_IN = {
  seconds: 1_000,
  minutes: 60_000,
  hours: 3.6e6,
  days: 8.64e7,
} as const;

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  INTERNAL_SERVER_ERROR: 500,
} as const;
