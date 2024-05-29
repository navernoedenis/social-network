import { drizzle } from 'drizzle-orm/node-postgres';
import { dbClient, cacheClient } from '@/config/db';
import * as schema from './schema';

export const db = drizzle(dbClient, { schema });
export const cache = cacheClient;
