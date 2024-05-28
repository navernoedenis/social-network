import './packages';

import { app } from '@/app';
import { ENV } from '@/config/env';
import { getErrorMessage } from '@/utils/helpers/error-message';
import { print, colorWord } from '@/utils/lib/print';

const startServer = async () => {
  try {
    app.listen(ENV.SERVER_PORT, ENV.SERVER_HOST, () => {
      const hostname = colorWord.many([
        ['http', 'white'],
        ['://', 'yellow'],
        [ENV.SERVER_HOST, 'grey'],
        [':', 'yellow'],
        [ENV.SERVER_PORT, 'white'],
      ]);

      print.success(`Server started working on: ${hostname}`);
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    print.error(errorMessage);
  }
};

startServer();
