import '@/packages';
import { db } from '@/db';
import * as schema from './schema/users';
import * as mocks from './mocks';
import { print } from '@/utils/lib/print';

import { dbClient } from '@/config/db-client.config';

const startSeeding = async () => {
  try {
    print.success('Connecting to database 🔌');
    await dbClient.connect();

    print.success('Seeding data...🌱🌱🌱');
    await db.insert(schema.users).values(mocks.users);

    print.success('Done!..🔥');
  } catch (error) {
    print.default(error);
  } finally {
    await dbClient.end();
  }
};

startSeeding();
