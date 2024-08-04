import { and, desc, eq, ne, SQL } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

import { getExpiredAt } from '@/utils/helpers';
import { type Request } from '@/types/main';

import { sessionTokensCache } from './session-tokens.cache';

class SessionsTokensService {
  async createOne(req: Request, payload: { userId: number; token: string }) {
    const [token] = await db
      .insert(entities.sessionTokens)
      .values({
        userId: payload.userId,
        token: payload.token,
        browser: req.useragent?.browser ?? 'Unknown browser',
        os: req.useragent?.os ?? 'Unknown browser',
        ip: req.socket.remoteAddress ?? 'Unknown ip',
        expiredAt: getExpiredAt(30, 'days'),
      })
      .returning();

    await sessionTokensCache.createOne(token);
    return token;
  }

  async getByToken(token: string) {
    const cacheData = await sessionTokensCache.getByToken(token);
    if (cacheData) return cacheData;

    const sessionToken = await db.query.sessionTokens.findFirst({
      where: eq(entities.sessionTokens.token, token),
    });

    if (sessionToken) {
      await sessionTokensCache.createOne(sessionToken);
    }

    return sessionToken;
  }

  async getById(id: string) {
    const cacheData = await sessionTokensCache.getById(id);
    if (cacheData) return cacheData;

    const sessionToken = await db.query.sessionTokens.findFirst({
      where: eq(entities.sessionTokens.id, id),
    });

    if (sessionToken) {
      await sessionTokensCache.createOne(sessionToken);
    }

    return sessionToken;
  }

  async getMany(userId: number, config: { withToken?: boolean } = {}) {
    const { withToken = false } = config;

    let tokens = await sessionTokensCache.getMany(userId);
    if (!tokens) {
      tokens = await db.query.sessionTokens.findMany({
        where: eq(entities.sessionTokens.userId, userId),
        orderBy: desc(entities.sessionTokens.expiredAt),
      });
    }

    if (!withToken) {
      return tokens.map((sessionToken) => ({ ...sessionToken, token: '' }));
    }

    return tokens;
  }

  async deleteOne(token: string) {
    await Promise.all([
      sessionTokensCache.deleteOne(token),
      db
        .delete(entities.sessionTokens)
        .where(eq(entities.sessionTokens.token, token)),
    ]);
  }

  async deleteMany(userId: number, exceptionToken?: string) {
    const sql: SQL[] = [eq(entities.sessionTokens.userId, userId)];

    if (exceptionToken) {
      sql.push(ne(entities.sessionTokens.token, exceptionToken));
    }

    await Promise.all([
      db.delete(entities.sessionTokens).where(and(...sql)),
      sessionTokensCache.deleteMany(userId, exceptionToken),
    ]);
  }
}

export const sessionsTokensService = new SessionsTokensService();
