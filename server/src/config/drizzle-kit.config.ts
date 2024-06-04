import '@/packages';
import { defineConfig } from 'drizzle-kit';
import { ENV } from '@/app/env';

const drizzleKitConfig = defineConfig({
  schema: './src/db/files/entities.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
});

export default drizzleKitConfig;
