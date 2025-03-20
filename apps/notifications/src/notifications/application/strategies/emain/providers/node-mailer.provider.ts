import { EmailProvider } from '../interfaces/email-provider';
import { SendEmailInput } from '../types/send-email.input';
import { SendEmailOutput } from '../types/send-email.output';
import { Transporter } from 'nodemailer';

export class NodeMailerProvider implements EmailProvider {
  constructor(private readonly nodemailer: Transporter) {}

  async send(input: SendEmailInput): Promise<SendEmailOutput> {
    await this.nodemailer.sendMail({
      to: input.receiver,
      subject: input.subject,
      html: input.html,
    });
    return { status: 'OK' };
  }
}
