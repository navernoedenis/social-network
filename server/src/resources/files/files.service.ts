import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { NewFile } from '@/db/files/mocks';

import * as entities from '@/db/files/entities';

class FileService {
  async createFiles(newFiles: NewFile[]) {
    return db.insert(entities.files).values(newFiles).returning();
  }

  async getFiles(fileIds: number[]) {
    return db.query.files.findMany({
      where: inArray(entities.files.id, fileIds),
    });
  }

  async deleteFiles(userId: number, fileIds: number[]) {
    const myFiles = and(
      eq(entities.files.userId, userId),
      inArray(entities.files.id, fileIds)
    );
    return db.delete(entities.files).where(myFiles).returning();
  }
}

export const fileService = new FileService();
