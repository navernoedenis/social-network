import { createClient } from 'redis';
import { ENV } from '@/app/env';
import { print } from '@/utils/lib';

export const cacheClient = createClient({
  url: `redis://default:password@${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`,
}).on('error', print.default);
