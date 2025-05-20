import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { ReferencesModule } from './references/references.module';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_URL: Joi.string().exist(),
        REDIS_HOST: Joi.string().exist(),
        REDIS_PORT: Joi.number(),
        REDIS_USER: Joi.string(),
        REDIS_PASSWORD: Joi.string(),
        RABBITMQ_URLS: Joi.string().exist(),
        RABBITMQ_QUEUE: Joi.string().exist(),
        HTTP_PORT: Joi.number().exist(),
        GRPC_URL: Joi.string().exist(),
        LOGGER_LEVEL: Joi.string(),
        LOGGER_PRETTY: Joi.boolean(),
        BYPASS_PERMISSIONS: Joi.boolean(),
      }),
    }),
    DatabaseModule,
    ReferencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
