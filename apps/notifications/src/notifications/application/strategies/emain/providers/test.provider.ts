import { EmailProvider } from '../interfaces/email-provider';
import { SendEmailInput } from '../types/send-email.input';
import { SendEmailOutput } from '../types/send-email.output';
import { PinoLogger } from 'nestjs-pino';

export class TestProvider implements EmailProvider {
  constructor(private readonly logger: PinoLogger) {}
  async send(input: SendEmailInput): Promise<SendEmailOutput> {
    this.logger.info('Message might be send');
    return { status: 'OK' };
  }
}
