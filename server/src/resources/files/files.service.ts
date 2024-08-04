import { and, eq, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { type NewFile } from '@/db/files/models';
import * as entities from '@/db/files/entities';

import { filesCache } from './files.cache';

class FilesService {
  async createMany(newFiles: NewFile[]) {
    const files = await db.insert(entities.files).values(newFiles).returning();

    await Promise.all(files.map((file) => filesCache.createOne(file)));
    return files;
  }

  async getOne(id: number) {
    const cacheData = await filesCache.getOne(id);
    if (cacheData) return cacheData;

    const file = await db.query.files.findFirst({
      where: eq(entities.files.id, id),
    });

    if (!file) return null;

    await filesCache.createOne(file);
    return file;
  }

  async getMany(fileIds: number[]) {
    const files = await Promise.all(fileIds.map((id) => this.getOne(id)));
    return files.filter((file) => file !== null);
  }

  async deleteMany(userId: number, fileIds: number[]) {
    await Promise.all(fileIds.map((id) => filesCache.deleteOne(id)));

    return db
      .delete(entities.files)
      .where(
        and(
          eq(entities.files.userId, userId),
          inArray(entities.files.id, fileIds)
        )
      )
      .returning();
  }
}

export const filesService = new FilesService();
