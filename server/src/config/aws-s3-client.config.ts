import { ENV } from '@/app/env';
import { S3Client } from '@aws-sdk/client-s3';

export const awsS3Client = new S3Client({
  region: ENV.AWS_S3_REGION,
  credentials: {
    accessKeyId: ENV.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_S3_SECRET_ACCESS_KEY,
  },
});
