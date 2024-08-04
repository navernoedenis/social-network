import { cache } from '@/db';

export abstract class CacheService {
  protected async create(key: string, data: unknown, EX: number) {
    await cache.set(key, JSON.stringify(data), { EX });
  }

  protected async get<T>(key: string) {
    const data = await cache.get(key);
    if (data) return JSON.parse(data) as T;
    return null;
  }

  protected async delete(key: string, type: 'one' | 'nested' = 'one') {
    if (type === 'nested') {
      const keys = await cache.keys(key + '*');
      if (keys.length) await cache.del(keys);
      return;
    }

    await cache.del(key);
  }
}
