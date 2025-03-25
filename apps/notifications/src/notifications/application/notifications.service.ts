import { Inject, Injectable } from '@nestjs/common';
import { SendNotificationInput } from './types/send-notification.input';
import { SendNotificationOutput } from './types/send-notification.output';
import { NotificationStrategy } from './enums/notification-strategies.enum';
import { TemplatesService } from '../../templates/application/templates.service';
import { EmailProvider } from './strategies/emain/interfaces/email-provider';
import { EMAIL_PROVIDER_TOKEN } from '../providers/email.provider.token';
import { Languages } from '../../shared/languages/languages.enum';
import { EmailOptions } from './types/email.options';
import { SmsOptions } from './types/sms.options';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(EMAIL_PROVIDER_TOKEN) private readonly emailProvider: EmailProvider,
    private readonly templateService: TemplatesService,
    private readonly logger: PinoLogger,
  ) {}

  async sendNotification(
    input: SendNotificationInput,
  ): Promise<SendNotificationOutput> {
    switch (input.strategy) {
      case NotificationStrategy.Email:
        return await this.sendEmailNotification(
          input.language,
          input.options as EmailOptions,
        );
      case NotificationStrategy.Sms:
        return await this.sendSmsNotification(
          input.language,
          input.options as SmsOptions,
        );
    }
  }

  private async sendEmailNotification(
    lang: Languages,
    options: EmailOptions,
  ): Promise<SendNotificationOutput> {
    const template = this.templateService.findEmailTemplate(
      options.templateId,
      lang,
    );
    const templateWithVariables = this.templateService.applyVariables(
      template,
      options.variables,
    );
    await this.emailProvider.send({
      receiver: options.receiverEmail,
      subject: templateWithVariables.subject,
      html: templateWithVariables.html,
    });
    return { status: 'OK' };
  }

  private async sendSmsNotification(
    lang: Languages,
    options: SmsOptions,
  ): Promise<SendNotificationOutput> {
    this.logger.info('Message might be sending', lang, options);
    return { status: 'OK' };
  }
}
