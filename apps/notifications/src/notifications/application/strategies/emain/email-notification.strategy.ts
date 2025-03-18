import { EmailProvider } from './interfaces/email-provider';
import { SendEmailInput } from './types/send-email.input';
import { SendEmailOutput } from './types/send-email.output';

export class EmailNotificationStrategy implements EmailProvider {
  constructor(private readonly provider: EmailProvider) {}

  async send(input: SendEmailInput): Promise<SendEmailOutput> {
    return await this.provider.send(input);
  }
}
