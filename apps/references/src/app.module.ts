import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { ReferencesModule } from './references/references.module';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { AccessRedisModule } from '@app/common/redis/accesses-redis';
import { JwtAuthModule } from '@app/common/auth';

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
    AccessRedisModule,
    JwtAuthModule,
    DatabaseModule,
    ReferencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
