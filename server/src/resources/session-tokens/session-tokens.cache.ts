import { CacheService } from '@/utils/services';
import { CACHE_EX } from '@/utils/constants';

import { type SessionToken } from '@/db/files/models';

class SessionTokensCache extends CacheService {
  async createOne(sessionToken: SessionToken) {
    const userKey = `session-tokens:user:${sessionToken.userId}`;
    const idKey = `session-tokens:id:${sessionToken.id}`;
    const tokenKey = `session-tokens:token:${sessionToken.token}`;

    const sessionTokens: SessionToken[] = [sessionToken];
    const cacheData = await this.get<SessionToken[]>(userKey);
    if (cacheData) sessionTokens.push(...cacheData);

    const ex = CACHE_EX.DAYS(30);
    await Promise.all([
      this.create(userKey, sessionTokens, ex),
      this.create(idKey, sessionToken, ex),
      this.create(tokenKey, sessionToken, ex),
    ]);
  }

  async getById(id: string) {
    const key = `session-tokens:id:${id}`;
    return this.get<SessionToken>(key);
  }

  async getByToken(token: string) {
    const key = `session-tokens:token:${token}`;
    return this.get<SessionToken>(key);
  }

  async getMany(userId: number) {
    const key = `session-tokens:user:${userId}`;
    return this.get<SessionToken[]>(key);
  }

  async deleteOne(token: string) {
    const tokenKey = `session-tokens:token:${token}`;
    const sessionToken = await this.get<SessionToken>(tokenKey);
    if (!sessionToken) return;

    const idKey = `session-tokens:id:${sessionToken.id}`;
    const userKey = `session-tokens:user:${sessionToken.userId}`;

    const sessionTokens: SessionToken[] = [sessionToken];
    const cacheData = await this.get<SessionToken[]>(userKey);
    if (cacheData) {
      const filteredTokens = cacheData.filter((item) => item.token !== token);
      sessionTokens.push(...filteredTokens);
    }

    const ex = CACHE_EX.DAYS(30);
    await Promise.all([
      this.create(userKey, sessionTokens, ex),
      this.delete(tokenKey),
      this.delete(idKey),
    ]);
  }

  async deleteMany(userId: number, exceptionToken?: string) {
    const userKey = `session-tokens:user:${userId}`;
    let cacheData = await this.get<SessionToken[]>(userKey);
    if (!cacheData) return;

    if (exceptionToken) {
      cacheData = cacheData.filter((st) => st.token !== exceptionToken);
    }

    const keysToRemove: string[] = [];

    for (const sessionToken of cacheData) {
      keysToRemove.push(`session-tokens:id:${sessionToken.id}`);
      keysToRemove.push(`session-tokens:token:${sessionToken.token}`);
    }

    const ex = CACHE_EX.DAYS(30);
    await Promise.all([
      this.create(userKey, [exceptionToken], ex),
      ...keysToRemove.map((key) => this.delete(key)),
    ]);
  }
}

export const sessionTokensCache = new SessionTokensCache();
