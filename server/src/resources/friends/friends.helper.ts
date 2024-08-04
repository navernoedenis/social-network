import { and, eq, inArray, or, SQL } from 'drizzle-orm';
import { db } from '@/db';
import * as entities from '@/db/files/entities';

export const buildFriendQuery = (userId: number, friendId: number) => {
  return or(
    and(
      eq(entities.friends.userId, userId),
      eq(entities.friends.friendId, friendId)
    ),
    and(
      eq(entities.friends.userId, friendId),
      eq(entities.friends.friendId, userId)
    )
  );
};

export const getFriendsData = async (config: {
  userId: number;
  page?: number;
  limit?: number;
  sql: SQL<unknown> | undefined;
}) => {
  const { userId, sql, page = 1, limit = 10 } = config;

  const friends = await db.query.friends.findMany({
    where: sql,
    limit,
    offset: limit * page - limit,
  });

  const ids = friends.map((item) =>
    item.userId === userId ? item.friendId : item.userId
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
};
