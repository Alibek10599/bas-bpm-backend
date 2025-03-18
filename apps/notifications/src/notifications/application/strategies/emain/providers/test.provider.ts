import { EmailProvider } from '../interfaces/email-provider';
import { SendEmailInput } from '../types/send-email.input';
import { SendEmailOutput } from '../types/send-email.output';

export class TestProvider implements EmailProvider {
  async send(input: SendEmailInput): Promise<SendEmailOutput> {
    console.log('Message might be send', input);
    return { status: 'OK' };
  }
}
