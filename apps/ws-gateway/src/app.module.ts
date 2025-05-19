import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { BpmnModule } from './modules/bpmn/bpmn.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_URL: Joi.string().exist(),
        RABBITMQ_URLS: Joi.string().exist(),
        RABBITMQ_QUEUE: Joi.string().exist(),
        HTTP_PORT: Joi.number().exist(),
        GRPC_URL: Joi.string().exist(),
        LOGGER_LEVEL: Joi.string(),
        LOGGER_PRETTY: Joi.boolean(),
        BYPASS_PERMISSIONS: Joi.boolean(),
      }),
    }),
    BpmnModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
