import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DocumentsModule } from './documents/documents.module';
import { FilesModule } from './files/files.module';
import { OnlyOfficeApiModule } from '@app/common/api/only-office';
import { TestDocumentProvider } from './utils/test-document.provider';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_URL: Joi.string().exist(),
        REDIS_URL: Joi.string().exist(),
        RABBITMQ_URLS: Joi.string().exist(),
        RABBITMQ_QUEUE: Joi.string().exist(),
        HTTP_PORT: Joi.number().exist(),
        GRPC_URL: Joi.string().exist(),
        LOGGER_LEVEL: Joi.string(),
        LOGGER_PRETTY: Joi.boolean(),
        BYPASS_PERMISSIONS: Joi.boolean(),
        MINIO_S3_ENDPOINT: Joi.string().exist(),
        MINIO_S3_ACCESS_KEY: Joi.string().exist(),
        MINIO_S3_SECRET_KEY: Joi.string().exist(),
        MINIO_S3_BUCKET_NAME: Joi.string().exist(),
        MINIO_S3_REGION: Joi.string().exist(),
      }),
      isGlobal: true,
    }),
    DocumentsModule,
    FilesModule,
    OnlyOfficeApiModule.forRoot({
      jwtSecret: 'my_jwt_secret',
      imports: [DatabaseModule, FilesModule],
      documentsProvider: TestDocumentProvider,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
