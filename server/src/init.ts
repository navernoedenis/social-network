import 'module-alias/register';
import dotenv from 'dotenv';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV ?? '';

dotenv.config({
  path: path.join(__dirname, `./env/.env.${NODE_ENV}`),
});
