import '@/packages';
import { dbClient } from '@/config/db-client.config';
import { db } from '@/db';
import { type NewVerification } from '@/db/files/models';
import * as entities from '@/db/files/entities';

import {
  createProfile,
  createSessionToken,
  createSettings,
  createUser,
} from '@/db/files/mocks';

import { print } from '@/utils/lib';
import {
  createHash,
  createJwtToken,
  createToken,
  getErrorMessage,
  getExpiredAt,
} from '@/utils/helpers';

const startSeeding = async () => {
  try {
    print.success('Connecting to database 🔌');
    await dbClient.connect();

    print.success('Seeding data...🌱🌱🌱');
    for (let index = 0; index < 20; index++) {
      const userData = createUser();

      const isAdmin = index === 0;
      if (isAdmin) {
        userData.role = 'admin';
        userData.email = 'admin@gmail.com';
        userData.username = 'denis';
      }

      const [user] = await db
        .insert(entities.users)
        .values(userData)
        .returning();

      const hash = await createHash('12345678');
      await db.insert(entities.passwords).values({
        userId: user.id,
        hash,
      });

      const profileData = createProfile(user.id);
      const [profile] = await db
        .insert(entities.profiles)
        .values(profileData)
        .returning();

      if (!profile.isEmailVerified) {
        const verificationData: NewVerification = {
          type: 'email',
          userId: user.id,
          payload: createToken(),
          expiredAt: getExpiredAt(2, 'hours'),
        };
        await db.insert(entities.verifications).values(verificationData);
      }

      const settingsData = createSettings(user.id);
      await db.insert(entities.settings).values(settingsData);

      const shouldAdd2FA = Math.random() >= 0.5;
      if (shouldAdd2FA) {
        await db.insert(entities.settings).values({
          userId: user.id,
          is2faEnabled: true,
        });

        await db.insert(entities.verifications).values({
          type: '2fa',
          userId: user.id,
          payload: createToken(),
          expiredAt: getExpiredAt(5, 'minutes'),
        });

        for (let i = 0; i < 3; i++) {
          const sessionToken = createSessionToken({
            userId: user.id,
            token: createJwtToken(
              {
                id: user.id,
                email: user.email,
                role: user.role,
              },
              'refresh'
            ),
            expiredAt: getExpiredAt(30, 'days'),
          });
          await db.insert(entities.sessionTokens).values(sessionToken);
        }
      }
    }

    print.success('Done!..🔥');
  } catch (error) {
    print.error(getErrorMessage(error));
  } finally {
    await dbClient.end();
  }
};

startSeeding();
