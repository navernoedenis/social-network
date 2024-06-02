import 'module-alias/register';
import dotenv from 'dotenv';
import path from 'path';
import { type ENV_MODE } from '@/types/global';

const mode: ENV_MODE = (process.env.NODE_ENV as ENV_MODE) ?? 'development';

dotenv.config({
  path: path.join(__dirname, `./envs/.env.${mode}`),
});
