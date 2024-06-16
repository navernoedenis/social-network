import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { NewFile } from '@/db/files/mocks';
import { files } from '@/db/files/entities';

class FileService {
  async createFiles(newFiles: NewFile | NewFile[]) {
    return db
      .insert(files)
      .values(newFiles as NewFile[])
      .returning();
  }

  async getFiles(userId: number, fileIds: string[]) {
    const myFiles = and(eq(files.authorId, userId), inArray(files.id, fileIds));
    return db.query.files.findMany({
      where: myFiles,
    });
  }

  async deleteFiles(userId: number, fileIds: string[]) {
    const myFiles = and(eq(files.authorId, userId), inArray(files.id, fileIds));
    return db.delete(files).where(myFiles).returning();
  }
}

export const fileService = new FileService();
