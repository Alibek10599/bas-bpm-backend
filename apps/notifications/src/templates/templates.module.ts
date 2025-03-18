import { Module } from '@nestjs/common';
import { TemplatesService } from './application/templates.service';
import { HttpNotificationController } from '../notifications/interface/http/http.notification.controller';
import { GrpcTemplatesController } from './interface/grpc/grpc.templates.controller';
import { RmqNotificationController } from '../notifications/interface/rmq/rmq.notification.controller';

@Module({
  controllers: [
    HttpNotificationController,
    GrpcTemplatesController,
    RmqNotificationController,
  ],
  providers: [TemplatesService],
})
export class TemplatesModule {}
