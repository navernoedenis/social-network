import { createClient } from 'redis';
import { Client } from 'pg';

import { ENV } from '@/app/env';
import { print } from '@/utils/lib/print';

export const dbClient = new Client({
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
});

export const cacheClient = createClient({
  url: `redis://default:password@${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`,
}).on('error', print.default);
