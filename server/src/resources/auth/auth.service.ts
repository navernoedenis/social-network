import { db } from '@/db';
import {
  emailVerifications,
  passwords,
  profiles,
  settings,
  users,
} from '@/db/files/entities';

import { getErrorMessage, getExpiredAt } from '@/utils/helpers';
import { type ExecutionResult } from '@/types/main';
import { type LoginDto } from './auth.types';

class AuthService {
  async signUp(
    data: LoginDto & { token: string }
  ): Promise<ExecutionResult<null>> {
    const { email, password, token } = data;

    try {
      await db.transaction(async (ctx) => {
        const [user] = await ctx.insert(users).values({ email }).returning();

        await ctx.insert(passwords).values({
          userId: user.id,
          hash: password,
        });

        await ctx.insert(profiles).values({
          userId: user.id,
        });

        await ctx.insert(emailVerifications).values({
          userId: user.id,
          email: user.email,
          token,
          expiredAt: getExpiredAt(2, 'hours'),
        });

        await ctx.insert(settings).values({
          userId: user.id,
        });
      });

      return {
        data: null,
      };
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
  }
}

export const authService = new AuthService();
