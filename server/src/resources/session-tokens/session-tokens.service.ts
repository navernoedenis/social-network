import { and, eq, ne } from 'drizzle-orm';
import { db } from '@/db';
import { sessionTokens } from '@/db/files/entities';
import { getExpiredAt } from '@/utils/helpers';

import { type Request } from '@/types/main';

class SessionsTokensService {
  async createOne(req: Request, payload: { userId: number; token: string }) {
    await db.insert(sessionTokens).values({
      userId: payload.userId,
      token: payload.token,
      browser: req.useragent?.browser ?? 'Unknown browser',
      os: req.useragent?.os ?? 'Unknown browser',
      ip: req.socket.remoteAddress ?? 'Unknown ip',
      expiredAt: getExpiredAt(30, 'days'),
    });
  }

  async findOne(token: string) {
    return db.query.sessionTokens.findFirst({
      where: eq(sessionTokens.token, token),
    });
  }

  async findMany(userId: number) {
    return db.query.sessionTokens.findMany({
      where: eq(sessionTokens.userId, userId),
    });
  }

  async revokeOne(id: string, userId: number) {
    const tokenIds = and(
      eq(sessionTokens.id, id),
      eq(sessionTokens.userId, userId)
    );

    const token = await db.query.sessionTokens.findFirst({
      where: tokenIds,
    });

    if (!token) {
      return null;
    }

    const [revokedToken] = await db
      .delete(sessionTokens)
      .where(tokenIds)
      .returning();

    return revokedToken;
  }

  async revokeMany(userId: number, token: string) {
    const notCurrent = and(
      eq(sessionTokens.userId, userId),
      ne(sessionTokens.token, token)
    );

    await db.delete(sessionTokens).where(notCurrent);
    return this.findOne(token);
  }

  async deleteOne(token: string) {
    await db.delete(sessionTokens).where(eq(sessionTokens.token, token));
  }
}

export const sessionsTokensService = new SessionsTokensService();
