import { z, type ZodIssue } from 'zod';
import { print } from '@/utils/lib';
import { type ENV_MODE } from '@/types/global';

const ENV_SCHEMA = z.object({
  DB_HOST: z.string().trim().min(1),
  DB_PORT: z.number({ coerce: true }).positive(),
  DB_NAME: z.string().trim().min(1),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string().trim().min(1),

  REDIS_HOST: z.string().trim().min(1),
  REDIS_PORT: z.number({ coerce: true }).positive(),

  SERVER_HOST: z.string().trim().min(1),
  SERVER_PORT: z.number({ coerce: true }).positive(),

  JWT_ACCESS_SECRET: z.string().trim().min(1),
  JWT_ACCESS_EXPIRE: z.string().trim().min(1),
  JWT_REFRESH_SECRET: z.string().trim().min(1),
  JWT_REFRESH_EXPIRE: z.string().trim().min(1),
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

const mode: ENV_MODE = (process.env.NODE_ENV as ENV_MODE) ?? 'development';

export const ENV = Object.assign({}, data, {
  IS_DEVELOPMENT: mode === 'development',
  IS_PRODUCTION: mode === 'production',
});
