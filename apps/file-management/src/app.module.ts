import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DocumentsModule } from './documents/documents.module';
import { FilesModule } from './files/files.module';
import { OnlyOfficeModule } from '@app/common/api/only-office';
import { TestFileProvider } from './utils/test-file.provider';

@Module({
  imports: [
    LoggerModule,
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
    OnlyOfficeModule.init(new TestFileProvider()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
