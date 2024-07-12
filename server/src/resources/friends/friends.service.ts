import { and, count, eq, inArray, or, SQL } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

class FriendsService {
  async getOne(myId: number, friendId: number) {
    return db.query.friends.findFirst({
      where: this.friendQuery(myId, friendId),
    });
  }

  async getMany(config: { myId: number; page: number; limit: number }) {
    const sql = and(
      eq(entities.friends.status, 'approved'),
      or(
        eq(entities.friends.userId, config.myId),
        eq(entities.friends.friendId, config.myId)
      )
    );

    return this.getFriends({ ...config, sql });
  }

  async createOne(myId: number, friendId: number) {
    const [friendship] = await db
      .insert(entities.friends)
      .values({ userId: myId, friendId, status: 'pending' })
      .returning();

    return friendship;
  }

  async deleteOne(myId: number, friendId: number) {
    const [removedFriend] = await db
      .delete(entities.friends)
      .where(this.friendQuery(myId, friendId))
      .returning();

    return removedFriend;
  }

  async approveOne(myId: number, friendId: number) {
    const [friendship] = await db
      .update(entities.friends)
      .set({ status: 'approved' })
      .where(this.friendQuery(myId, friendId))
      .returning();

    return friendship;
  }

  async friendsCount(myId: number) {
    const approvedQuery = eq(entities.friends.status, 'approved');
    const friendQuery = or(
      eq(entities.friends.userId, myId),
      eq(entities.friends.friendId, myId)
    );

    const [result] = await db
      .select({ count: count() })
      .from(entities.friends)
      .where(and(approvedQuery, friendQuery));

    return result.count;
  }

  async getRequests(config: { myId: number; page: number; limit: number }) {
    const sql = and(
      eq(entities.friends.friendId, config.myId),
      eq(entities.friends.status, 'pending')
    );

    return this.getFriends({ ...config, sql });
  }

  async getMyRequests(config: { myId: number; page: number; limit: number }) {
    const sql = and(
      eq(entities.friends.userId, config.myId),
      eq(entities.friends.status, 'pending')
    );

    return this.getFriends({ ...config, sql });
  }

  private friendQuery(myId: number, friendId: number) {
    return or(
      and(
        eq(entities.friends.userId, myId),
        eq(entities.friends.friendId, friendId)
      ),
      and(
        eq(entities.friends.userId, friendId),
        eq(entities.friends.friendId, myId)
      )
    );
  }

  private async getFriends(config: {
    limit?: number;
    myId: number;
    page?: number;
    sql: SQL<unknown> | undefined;
  }) {
    const { myId, sql, page = 1, limit = 0 } = config;

    const requests = await db.query.friends.findMany({
      where: sql,
      limit,
      offset: limit * page - limit,
    });

    const ids = requests.map((request) =>
      request.userId === myId ? request.friendId : request.userId
    );

    if (!ids.length) {
      return [];
    }

    return db.query.users.findMany({
      where: inArray(entities.users.id, ids),
      with: {
        profile: true,
      },
    });
  }
}

export const friendsService = new FriendsService();
