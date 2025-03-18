import { NotificationStrategy } from '../enums/notification-strategies.enum';

export class SendNotificationInput {
  strategy: NotificationStrategy;
  templateId: string;
  receiver: string;
}
