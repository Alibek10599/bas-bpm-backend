import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { CodeExecutionModule } from './code-execution/code-execution.module';

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
    CodeExecutionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
