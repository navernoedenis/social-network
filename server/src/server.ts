import './packages';

import { app } from '@/app';
import { ENV } from '@/app/env';
import { dbClient, cacheClient } from '@/config/db';
import { getErrorMessage } from '@/utils/helpers/error-message';
import { print, colorWord } from '@/utils/lib/print';

const startServer = async () => {
  try {
    await Promise.all([dbClient.connect(), cacheClient.connect()]);

    app.listen(ENV.SERVER_PORT, ENV.SERVER_HOST, () => {
      const hostname = colorWord.one(
        `http://${ENV.SERVER_HOST}:${ENV.SERVER_PORT}`,
        'yellow'
      );

      print.success(`Server started working on: ${hostname}`);
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    print.error(errorMessage);
  }
};

startServer();
