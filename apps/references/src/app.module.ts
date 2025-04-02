import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { ReferencesModule } from './references/references.module';
import * as Joi from 'joi';

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
    ReferencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
