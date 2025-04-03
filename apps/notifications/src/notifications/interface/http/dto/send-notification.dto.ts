import { NotificationStrategy } from '../../../application/enums/notification-strategies.enum';
import { IsEnum, ValidateNested } from 'class-validator';
import { Languages } from '../../../../shared/languages/languages.enum';
import { EmailOptions } from '../../../application/types/email.options';
import { Type } from 'class-transformer';
import { SmsOptions } from '../../../application/types/sms.options';

export class SendNotificationDto {
  @IsEnum(NotificationStrategy)
  strategy: NotificationStrategy;

  @IsEnum(Languages)
  language: Languages;

  @ValidateNested()
  @Type((d) =>
    d.object.strategy === NotificationStrategy.Sms ? SmsOptions : EmailOptions,
  )
  options: EmailOptions | SmsOptions;
}
