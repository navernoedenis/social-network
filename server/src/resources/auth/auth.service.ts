import { db } from '@/db';
import { type User } from '@/db/files/models';
import {
  passwords,
  profiles,
  settings,
  users,
  verifications,
} from '@/db/files/entities';

import { type ExecutionResult } from '@/types/main';
import { getErrorMessage, getExpiredAt } from '@/utils/helpers';

class AuthService {
  async signUp({
    email,
    password,
    verificationToken,
  }: {
    email: string;
    password: string;
    verificationToken: string;
  }): ExecutionResult<User> {
    try {
      let newUser!: User;

      await db.transaction(async (ctx) => {
        const [user] = await ctx.insert(users).values({ email }).returning();

        await ctx.insert(passwords).values({
          userId: user.id,
          hash: password,
        });

        await ctx.insert(profiles).values({
          userId: user.id,
        });

        await ctx.insert(verifications).values({
          type: 'email',
          userId: user.id,
          payload: verificationToken,
          expiredAt: getExpiredAt(15, 'minutes'),
        });

        await ctx.insert(settings).values({
          userId: user.id,
        });

        newUser = user;
      });

      return {
        data: newUser,
      };
    } catch (error) {
      return {
        error: getErrorMessage(error),
      };
    }
  }
}

export const authService = new AuthService();
