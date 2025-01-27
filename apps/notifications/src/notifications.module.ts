import { Module } from '@nestjs/common';
import { notificationsService } from './notifications.service';
import { notificationsController } from './notifications.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { notificationsRepository } from './notifications.repository';
import { NotificationDocument } from './models/notification.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';

@Module({
  imports: [
    // DatabaseModule,
    // DatabaseModule.forFeature([NotificationDocument]),
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
  controllers: [notificationsController],
  providers: [notificationsService, notificationsRepository],
})
export class notificationsModule {}
