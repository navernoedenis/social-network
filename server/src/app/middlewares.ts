import { type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import { ENV } from '@/config/env';
import { logger } from '@/utils/lib/logger';

export const middlewares: RequestHandler[] = [
  getCors(),
  helmet(),
  cookieParser(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
];

if (ENV.NODE_ENV === 'development') {
  middlewares.push(...[logger]);
}

if (ENV.NODE_ENV === 'production') {
  middlewares.push(...[getCompression(), getRateLimiter()]);
}

function getCors() {
  return cors({
    origin: ['*'],
    credentials: true,
  });
}

function getCompression() {
  return compression({ level: 9 });
}

function getRateLimiter() {
  return rateLimit({
    limit: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Your limit of requests was over. Try in 15 minutes',
  });
}
