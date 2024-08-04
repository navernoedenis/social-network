import { CACHE_EX } from '@/utils/constants';
import { CacheService } from '@/utils/services';
import { type Conversation } from '@/db/files/models';

class ConversationsCache extends CacheService {
  async createOne(params: {
    userId: number;
    friendId: number;
    conversation: Conversation;
  }) {
    const { userId, friendId, conversation } = params;

    const key = `conversations:id:${conversation.id}`;
    const myKey = `conversations:user:${userId}:friend:${friendId}`;
    const userKey = `conversations:user:${friendId}:friend:${userId}`;

    const ex = CACHE_EX.DAYS(7);

    await Promise.all([
      this.create(key, conversation, ex),
      this.create(myKey, conversation.id, ex),
      this.create(userKey, conversation.id, ex),
    ]);
  }

  async createMany(userId: number, data: unknown) {
    const key = `conversations:user:${userId}:many`;
    const ex = CACHE_EX.DAYS(7);
    await this.create(key, data, ex);
  }

  async getOne(userId: number, friendId: number) {
    const myKey = `conversations:user:${userId}:friend:${friendId}`;
    const id = await this.get<number>(myKey);

    if (!id) return null;

    const key = `conversations:id:${id}`;
    return this.get<Conversation>(key);
  }

  async getMany(userId: number) {
    const key = `conversations:user:${userId}:many`;
    return this.get<Conversation[]>(key);
  }

  async deleteOne(id: number) {
    const key = `conversations:id:${id}`;
    await this.delete(key);
  }

  async deleteMany(userId: number) {
    const key = `conversations:user:${userId}:many`;
    await this.delete(key);
  }
}

export const conversationsCache = new ConversationsCache();
