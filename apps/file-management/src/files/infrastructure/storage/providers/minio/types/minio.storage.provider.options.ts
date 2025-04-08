import { S3Client } from '@aws-sdk/client-s3';

export class MinioStorageProviderOptions {
  client: S3Client;
  bucketName: string;
}
