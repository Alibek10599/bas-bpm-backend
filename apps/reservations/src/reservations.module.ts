import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument } from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';
import { AccessRedisModule } from '@app/common/redis/accesses-redis';
import { JwtAuthModule } from '@app/common/auth';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([ReservationDocument]),
    LoggerModule,
    AccessRedisModule,
    JwtAuthModule,
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
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
