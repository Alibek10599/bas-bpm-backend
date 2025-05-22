import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';
import { TasksModule } from './tasks/tasks.module';
import { TasksVersionsModule } from './tasks-versions/tasks-versions.module';
import { TasksDelegationsModule } from './tasks-delegations/tasks-delegations.module';
import { DatabaseModule } from './database/database.module';
import { AccessRedisModule } from '@app/common/redis/accesses-redis';
import { JwtAuthModule } from '@app/common/auth';

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
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AccessRedisModule,
    JwtAuthModule,
    DatabaseModule,
    TasksModule,
    TasksVersionsModule,
    TasksDelegationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
