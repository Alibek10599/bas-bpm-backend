import { EmailNotificationStrategy } from '../application/strategies/emain/email-notification.strategy';
import { ConfigService } from '@nestjs/config';
import { TestProvider } from '../application/strategies/emain/providers/test.provider';
import { Provider } from '@nestjs/common';
import { EMAIL_PROVIDER_TOKEN } from './email.provider.token';

export const emailProvider: Provider = {
  provide: EMAIL_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService) => {
    console.log('emailProvider factory called');
    return new EmailNotificationStrategy(new TestProvider());
  },
  inject: [ConfigService],
};

//import { NodeMailerProvider } from '../application/strategies/emain/providers/node-mailer.provider';
//import { createTransport } from 'nodemailer';
// new NodeMailerProvider(
//   createTransport({
//     host: configService.get<string>('NODEMAILER_HOST'),
//     port: configService.get<number>('NODEMAILER_PORT'),
//     secure: configService.get<boolean>('NODEMAILER_SECURE'),
//     auth: {
//       user: configService.get<string>('NODEMAILER_USER'),
//       pass: configService.get<string>('NODEMAILER_PASS'),
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   }),
// ),
