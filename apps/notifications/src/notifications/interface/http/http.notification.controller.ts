import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../../application/notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('notifications')
export class HttpNotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Post('send')
  sendNotification(
    @Body()
    data: SendNotificationDto,
  ) {
    return this.notificationsService.sendNotification(data);
  }
}
