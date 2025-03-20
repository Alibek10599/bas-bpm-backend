import { SendEmailInput } from '../types/send-email.input';
import { SendEmailOutput } from '../types/send-email.output';

export interface EmailProvider {
  send(input: SendEmailInput): Promise<SendEmailOutput>;
}
