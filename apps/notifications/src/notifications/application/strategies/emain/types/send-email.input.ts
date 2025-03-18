export class SendEmailInput {
  receiver: string;
  subject: string;
  html: string;
  text?: string;
}
