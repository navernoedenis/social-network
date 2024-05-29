import 'module-alias/register';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `./envs/.env.${process.env.NODE_ENV}`),
});
