import { Provider } from '@nestjs/common';
import { STORAGE_PROVIDER_TOKEN } from './infrastructure/storage/providers/storage.provider.token';
import { StorageProvider } from './infrastructure/storage/storage.provider';
import { MinioStorageProvider } from './infrastructure/storage/providers/minio/minio.storage.provider';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const filesStorageFactory: Provider = {
  provide: STORAGE_PROVIDER_TOKEN,
  useFactory: async (
    configService: ConfigService,
  ): Promise<StorageProvider> => {
    const client = new S3Client({
      region: configService.get<string>('MINIO_S3_REGION'),
      endpoint: configService.get<string>('MINIO_S3_ENDPOINT'),
      credentials: {
        accessKeyId: configService.get<string>('MINIO_S3_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('MINIO_S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    return await MinioStorageProvider.init({
      client,
      bucketName: configService.get<string>('MINIO_S3_BUCKET_NAME'),
    });
  },
  inject: [ConfigService],
};
