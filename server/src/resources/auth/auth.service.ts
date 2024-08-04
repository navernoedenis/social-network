import { db } from '@/db';
import { getExpiredAt } from '@/utils/helpers';
import * as entities from '@/db/files/entities';

import { type SignUpData } from './auth.types';

class AuthService {
  async signUp(data: SignUpData) {
    await db.transaction(async (ctx) => {
      const [user] = await ctx
        .insert(entities.users)
        .values({ email: data.email, username: data.username })
        .returning();

      await ctx.insert(entities.passwords).values({
        userId: user.id,
        hash: data.password,
      });

      await ctx.insert(entities.profiles).values({
        userId: user.id,
      });

      await ctx.insert(entities.verifications).values({
        type: 'email',
        userId: user.id,
        payload: data.verificationToken,
        expiredAt: getExpiredAt(15, 'minutes'),
      });

      await ctx.insert(entities.settings).values({
        userId: user.id,
      });
    });
  }
}

export const authService = new AuthService();
