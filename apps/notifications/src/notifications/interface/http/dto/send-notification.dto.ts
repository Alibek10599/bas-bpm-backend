import { NotificationStrategy } from '../../../application/enums/notification-strategies.enum';
import { IsEnum, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsEnum(NotificationStrategy)
  strategy: NotificationStrategy;

  @IsString()
  templateId: string;

  @IsString()
  receiver: string;
}
