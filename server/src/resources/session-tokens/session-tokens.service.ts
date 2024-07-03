import { and, eq, ne, getTableColumns, SQL } from 'drizzle-orm';
import { db } from '@/db';
import { getExpiredAt } from '@/utils/helpers';
import { type Request } from '@/types/main';

import * as entities from '@/db/files/entities';

class SessionsTokensService {
  async createOne(req: Request, payload: { userId: number; token: string }) {
    await db.insert(entities.sessionTokens).values({
      userId: payload.userId,
      token: payload.token,
      browser: req.useragent?.browser ?? 'Unknown browser',
      os: req.useragent?.os ?? 'Unknown browser',
      ip: req.socket.remoteAddress ?? 'Unknown ip',
      expiredAt: getExpiredAt(30, 'days'),
    });
  }

  async getOne(token: string) {
    return db.query.sessionTokens.findFirst({
      where: eq(entities.sessionTokens.token, token),
    });
  }

  async getMany(userId: number, config: { addTokenColumn?: boolean } = {}) {
    const { token, ...columns } = getTableColumns(entities.sessionTokens);
    const { addTokenColumn = false } = config;

    return db
      .select({ ...columns, ...(addTokenColumn && { token }) })
      .from(entities.sessionTokens)
      .where(eq(entities.sessionTokens.userId, userId));
  }

  async revokeOne(
    params:
      | { userId: number; tokenId: string; token?: never }
      | { userId: number; tokenId?: never; token: string }
  ) {
    const clauses: SQL[] = [eq(entities.sessionTokens.userId, params.userId)];

    if (params.token) {
      clauses.push(eq(entities.sessionTokens.token, params.token));
    }

    if (params.tokenId) {
      clauses.push(eq(entities.sessionTokens.id, params.tokenId));
    }

    const tokenQuery = and(...clauses);
    const token = await db.query.sessionTokens.findFirst({
      where: tokenQuery,
    });

    if (!token) {
      return null;
    }

    const [revokedToken] = await db
      .delete(entities.sessionTokens)
      .where(tokenQuery)
      .returning();

    return revokedToken;
  }

  async revokeMany(userId: number, config: { exceptCurrentToken: string }) {
    const notCurrent = and(
      eq(entities.sessionTokens.userId, userId),
      ne(entities.sessionTokens.token, config.exceptCurrentToken)
    );

    await db.delete(entities.sessionTokens).where(notCurrent);
  }

  async deleteOne(token: string) {
    await db
      .delete(entities.sessionTokens)
      .where(eq(entities.sessionTokens.token, token));
  }
}

export const sessionsTokensService = new SessionsTokensService();
