import { Controller } from '@nestjs/common';
import { NotificationsService } from '../../application/notifications.service';
import { SendNotificationDto } from '../http/dto/send-notification.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class RmqNotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('send.notification')
  sendNotification(data: SendNotificationDto) {
    return this.notificationsService.sendNotification(data);
  }
}
