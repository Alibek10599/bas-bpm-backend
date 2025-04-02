import { Controller, UseInterceptors } from '@nestjs/common';
import { NotificationsService } from '../../application/notifications.service';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { SendNotificationsEnumInterceptor } from './interceptors/send-notifications-enums.interceptor';
import { SendNotificationDto } from '../http/dto/send-notification.dto';

@Controller()
export class GrpcNotificationController {
  constructor(private readonly notificationService: NotificationsService) {}

  @UseInterceptors(SendNotificationsEnumInterceptor)
  @GrpcMethod('NotificationService', 'SendNotification')
  async sendNotification(@Payload() data: SendNotificationDto) {
    return await this.notificationService.sendNotification(data);
  }
}
