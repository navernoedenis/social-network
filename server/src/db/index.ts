import { drizzle } from 'drizzle-orm/node-postgres';
import { dbClient } from '@/config/db-client.config';
import { cacheClient } from '@/config/cache-client.config';
import * as schema from './schema';

export const db = drizzle(dbClient, { schema });
export const cache = cacheClient;
