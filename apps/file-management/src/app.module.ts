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
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string(),
        AUTH_SERVICE_HOST: Joi.string(),
        AUTH_SERVICE_PORT: Joi.number(),
        HTTP_PORT: Joi.number(),
      }),
    }),
    DocumentsModule,
    FilesModule,
    OnlyOfficeApiModule.forRoot({
      jwtSecret: 'my_jwt_secret',
      imports: [DatabaseModule],
      documentsProvider: TestDocumentProvider,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
