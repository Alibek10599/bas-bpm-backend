import { Inject, Injectable } from '@nestjs/common';
import { SendNotificationInput } from './types/send-notification.input';
import { SendNotificationOutput } from './types/send-notification.output';
import { NotificationStrategy } from './enums/notification-strategies.enum';
import { TemplatesService } from '../../templates/application/templates.service';
import { TemplateDocument } from '../../templates/domain/models/template.schema';
import { EmailProvider } from './strategies/emain/interfaces/email-provider';
import { SendEmailOutput } from './strategies/emain/types/send-email.output';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('EMAIL_PROVIDER') private readonly emailProvider: EmailProvider,
    private readonly templateService: TemplatesService,
  ) {}

  async sendNotification(
    input: SendNotificationInput,
  ): Promise<SendNotificationOutput> {
    const template = await this.templateService.findOne(input.templateId);
    return await this.sendNotificationByStrategy(input, template);
  }

  private async sendNotificationByStrategy(
    input: SendNotificationInput,
    template: TemplateDocument,
  ): Promise<SendEmailOutput> {
    switch (input.strategy) {
      case NotificationStrategy.Email:
        return await this.sendEmailNotification(input.receiver, template);
    }
  }

  private async sendEmailNotification(
    receiver: string,
    template: TemplateDocument,
  ): Promise<SendNotificationOutput> {
    await this.emailProvider.send({
      receiver: receiver,
      subject: template.title,
      html: template.text,
    });
    return { status: 'OK' };
  }
}
