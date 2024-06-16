import fs from 'node:fs';
import path from 'node:path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { awsS3Client } from '@/config/aws-s3-client.config';
import { ENV } from '@/app/env';
import { createToken } from '@/utils/helpers';
import { type MediaFile } from '@/types/main';

type BucketFile = {
  bucketKey: string;
  filename: string;
  url: string;
};

class AwsS3Service {
  async uploadFile(file: MediaFile) {
    const bucketKey = this.createBucketKey(file);
    const putCommand = new PutObjectCommand({
      Body: fs.createReadStream(file.filepath),
      Bucket: ENV.AWS_S3_BUCKET_NAME,
      Key: bucketKey,
    });

    await awsS3Client.send(putCommand);
    const url = await getSignedUrl(awsS3Client, putCommand);

    const bucketFile: BucketFile = {
      bucketKey,
      filename: file.originalFilename?.split('.')[0] ?? file.newFilename,
      url: url.split('?')[0],
    };

    return bucketFile;
  }

  async uploadFiles(files: MediaFile[]) {
    const bucketFiles: BucketFile[] = [];

    for (const file of files) {
      const bucketFile = await this.uploadFile(file);
      bucketFiles.push(bucketFile);
    }

    return bucketFiles;
  }

  async deleteFile(bucketKey: string) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: ENV.AWS_S3_BUCKET_NAME,
      Key: bucketKey,
    });
    await awsS3Client.send(deleteCommand);
  }

  async deleteFiles(bucketKeys: string[]) {
    for (const bucketKey of bucketKeys) {
      await this.deleteFile(bucketKey);
    }
  }

  private createBucketKey(file: MediaFile) {
    const filename = createToken();
    const type = file.mimetype!.split('/')[0];
    const ext = path.extname(file.originalFilename!).slice(1);
    return `${type}s/${filename}.${ext}`;
  }
}

export const awsS3Service = new AwsS3Service();
