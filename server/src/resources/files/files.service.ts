import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { NewFile } from '@/db/files/models';

import * as entities from '@/db/files/entities';

class FilesService {
  async createMany(newFiles: NewFile[]) {
    return db.insert(entities.files).values(newFiles).returning();
  }

  async getMany(fileIds: number[]) {
    return db.query.files.findMany({
      where: inArray(entities.files.id, fileIds),
    });
  }

  async deleteMany(userId: number, fileIds: number[]) {
    const myFiles = and(
      eq(entities.files.userId, userId),
      inArray(entities.files.id, fileIds)
    );
    return db.delete(entities.files).where(myFiles).returning();
  }
}

export const filesService = new FilesService();
