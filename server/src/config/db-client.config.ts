import { Client } from 'pg';
import { ENV } from '@/app/env';

export const dbClient = new Client({
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  database: ENV.DB_NAME,
});
