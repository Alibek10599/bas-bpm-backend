import { Module } from '@nestjs/common';
import { GrpcNotificationController } from './interface/grpc/grpc.notification.controller';
import { HttpNotificationController } from './interface/http/http.notification.controller';
import { RmqNotificationController } from './interface/rmq/rmq.notification.controller';
import { NotificationsService } from './application/notifications.service';
import { TemplatesModule } from '../templates/templates.module';
import { emailProvider } from './providers/email.provider';

@Module({
  imports: [TemplatesModule],
  controllers: [
    GrpcNotificationController,
    HttpNotificationController,
    RmqNotificationController,
  ],
  providers: [...emailProvider, NotificationsService],
})
export class NotificationsModule {}
