import './packages';

import { httpServer } from '@/app';
import { ENV } from '@/app/env';
import { initSocket } from '@/socket';

import { cacheClient } from '@/config/cache-client.config';
import { dbClient } from '@/config/db-client.config';

import { getErrorMessage } from '@/utils/helpers';
import { print, colorWord } from '@/utils/lib';

const startServer = async () => {
  try {
    await Promise.all([dbClient.connect(), cacheClient.connect()]);

    httpServer.listen(ENV.SERVER_PORT, ENV.SERVER_HOST, () => {
      initSocket(httpServer);

      const hostname = colorWord.one(
        `http://${ENV.SERVER_HOST}:${ENV.SERVER_PORT}`,
        'yellow'
      );

      print.success(`Server started working on: ${hostname} ✨`);
    });
  } catch (error) {
    print.error(getErrorMessage(error));
    await dbClient.end();
    await cacheClient.disconnect();
    process.exit(1);
  }
};

startServer();
