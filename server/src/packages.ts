import 'module-alias/register';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `./env/.env.${process.env.NODE_ENV}`),
});
