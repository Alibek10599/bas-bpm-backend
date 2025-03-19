import { NotificationStrategy } from '../enums/notification-strategies.enum';
import { Languages } from '../../../shared/languages/languages.enum';
import { EmailOptions } from './email.options';
import { SmsOptions } from './sms.options';

export class SendNotificationInput {
  strategy: NotificationStrategy;

  languages: Languages;

  options: EmailOptions | SmsOptions;
}
