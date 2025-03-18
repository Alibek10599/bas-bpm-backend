import { EmailNotificationStrategy } from '../application/strategies/emain/email-notification.strategy';
import { NodeMailerProvider } from '../application/strategies/emain/providers/node-mailer.provider';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const emailProvider = [
  {
    provide: 'EMAIL_PROVIDER',
    useFactory: (configService: ConfigService) => {
      return new EmailNotificationStrategy(
        new NodeMailerProvider(
          createTransport({
            host: configService.get<string>('NODEMAILER_HOST'),
            port: configService.get<number>('NODEMAILER_PORT'),
            secure: configService.get<boolean>('NODEMAILER_SECURE'),
            auth: {
              user: configService.get<string>('NODEMAILER_USER'),
              pass: configService.get<string>('NODEMAILER_PASS'),
            },
            tls: {
              rejectUnauthorized: false,
            },
          }),
        ),
      );
    },
    inject: [ConfigService],
  },
];
