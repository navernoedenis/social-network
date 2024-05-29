import { z, type ZodIssue } from 'zod';
import { print } from '@/utils/lib/print';

const validate = {
  env: z.union([z.literal('development'), z.literal('production')]),
  port: z.number({ coerce: true }).positive(),
  string: z.string().trim().min(1),
};

const ENV_SCHEMA = z.object({
  NODE_ENV: validate.env,

  SERVER_HOST: validate.string,
  SERVER_PORT: validate.port,

  JWT_ACCESS_SECRET: validate.string,
  JWT_ACCESS_EXPIRE: validate.string,
  JWT_REFRESH_SECRET: validate.string,
  JWT_REFRESH_EXPIRE: validate.string,

  DB_HOST: validate.string,
  DB_PORT: validate.port,
  DB_NAME: validate.string,
  DB_USER: validate.string,
  DB_PASSWORD: validate.string,

  REDIS_HOST: validate.string,
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

export const ENV = Object.assign({}, data, {
  IS_DEVELOPMENT: data.NODE_ENV === 'development',
  IS_PRODUCTION: data.NODE_ENV === 'production',
});