import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { type Status } from '@/db/files/models';
import * as entities from '@/db/files/entities';

class StatusService {
  async getOne(userId: number) {
    const status = await db.query.status.findFirst({
      where: eq(entities.status.userId, userId),
    });
    return status as Status;
  }

  async updateOne(userId: number, config: { isOnline: boolean }) {
    const [updatedStatus] = await db
      .update(entities.status)
      .set({ isOnline: config.isOnline })
      .where(eq(entities.status.userId, userId))
      .returning();

    return updatedStatus;
  }
}

export const statusService = new StatusService();
