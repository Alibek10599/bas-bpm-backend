import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from '../../application/notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
export class HttpNotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/send')
  sendNotification(
    @Body()
    data: SendNotificationDto,
  ) {
    return this.notificationsService.sendNotification(data);
  }
}
