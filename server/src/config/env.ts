import { z, type ZodIssue } from 'zod';
import { print } from '@/utils/lib/print';

const validate = {
  string: z.string().trim().min(1, "Can't be empty"),
  port: z.number({ coerce: true }).positive('Wrong port'),
  host: z.union([
    z.literal('localhost'),
    z.string().ip({ version: 'v4', message: 'Invalid host address' }),
  ]),
};

const ENV_SCHEMA = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),

  CLIENT_HOST: validate.host,
  CLIENT_PORT: validate.port,

  SERVER_HOST: validate.host,
  SERVER_PORT: validate.port,

  JWT_ACCESS_SECRET: validate.string,
  JWT_ACCESS_EXPIRE: validate.string,
  JWT_REFRESH_SECRET: validate.string,
  JWT_REFRESH_EXPIRE: validate.string,

  DB_HOST: validate.host,
  DB_PORT: validate.port,
  DB_NAME: validate.string,
  DB_USER: validate.string,
  DB_PASSWORD: validate.string,

  REDIS_HOST: validate.host,
  REDIS_PORT: validate.port,
});

const printErrors = (errors: ZodIssue[]) => {
  errors.forEach((error) => {
    const key = error.path[0];
    const message = error.message;
    print.error(`${key}: ${message}`);
  });
};

const { error, data } = ENV_SCHEMA.safeParse(process.env);

if (error) {
  printErrors(error.errors);
  throw new Error('Env validation errors');
}

export const ENV = data;
