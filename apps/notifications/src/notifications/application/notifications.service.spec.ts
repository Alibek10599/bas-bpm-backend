import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { EmailProvider } from './strategies/emain/interfaces/email-provider';
import { TemplatesService } from '../../templates/application/templates.service';
import { PinoLogger } from 'nestjs-pino';
import { EMAIL_PROVIDER_TOKEN } from '../providers/email.provider.token';
import { SmsOptions } from './types/sms.options';
import { Languages } from '../../shared/languages/languages.enum';
import { NotificationStrategy } from './enums/notification-strategies.enum';
import { EmailOptions } from './types/email.options';
import { EmailTemplatesEnum } from '../../templates/shared/enums/email.templates.enum';
import { SendNotificationInput } from './types/send-notification.input';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let emailProvider: EmailProvider;
  let templateService: TemplatesService;
  let logger: PinoLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: EMAIL_PROVIDER_TOKEN,
          useValue: { send: jest.fn() },
        },
        {
          provide: TemplatesService,
          useValue: {
            findEmailTemplate: jest.fn(),
            applyVariables: jest.fn(),
          },
        },
        {
          provide: PinoLogger,
          useValue: { info: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    emailProvider = module.get<EmailProvider>(EMAIL_PROVIDER_TOKEN);
    templateService = module.get<TemplatesService>(TemplatesService);
    logger = module.get<PinoLogger>(PinoLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email notification', async () => {
    const mockInput = {
      strategy: NotificationStrategy.Email,
      language: Languages.en,
      options: {
        templateId: EmailTemplatesEnum.WELCOME,
        receiverEmail: 'test@example.com',
        variables: {},
      } as EmailOptions,
    };
    const mockTemplate = { subject: 'Test Subject', html: '<p>Test</p>' };

    jest
      .spyOn(templateService, 'findEmailTemplate')
      .mockReturnValue(mockTemplate);
    jest.spyOn(templateService, 'applyVariables').mockReturnValue(mockTemplate);
    jest.spyOn(emailProvider, 'send').mockResolvedValue(undefined);

    const result = await service.sendNotification(mockInput);
    expect(result).toEqual({ status: 'OK' });
    expect(emailProvider.send).toHaveBeenCalledWith({
      receiver: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test</p>',
    });
  });

  it('should send an SMS notification', async () => {
    const mockInput = {
      strategy: NotificationStrategy.Sms,
      language: Languages.en,
      options: {
        phone: '+123456789',
        variables: {},
      } as SmsOptions,
    };

    const result = await service.sendNotification(mockInput);
    expect(result).toEqual({ status: 'OK' });
    expect(logger.info).toHaveBeenCalledWith(
      'Message might be sending',
      mockInput.language,
      mockInput.options,
    );
  });

  /*** 1️⃣ Ошибка при отправке Email ***/
  it('should throw an error if email provider fails', async () => {
    (emailProvider.send as jest.Mock).mockRejectedValue(
      new Error('Email sending failed'),
    );

    const input: SendNotificationInput = {
      strategy: NotificationStrategy.Email,
      language: Languages.ru,
      options: {
        templateId: EmailTemplatesEnum.WELCOME,
        receiverEmail: 'test@example.com',
        variables: {},
      },
    };

    const mockTemplate = { subject: 'Test Subject', html: '<p>Test</p>' };

    jest
      .spyOn(templateService, 'findEmailTemplate')
      .mockReturnValue(mockTemplate);
    jest.spyOn(templateService, 'applyVariables').mockReturnValue(mockTemplate);

    await expect(service.sendNotification(input)).rejects.toThrow(
      'Email sending failed',
    );
  });

  /*** 2️⃣ Ошибка: Шаблон не найден ***/
  it('should throw an error if email template is not found', async () => {
    (templateService.findEmailTemplate as jest.Mock).mockReturnValue(null);

    const input: SendNotificationInput = {
      strategy: NotificationStrategy.Email,
      language: Languages.ru,
      options: {
        templateId: 'invalid' as any,
        receiverEmail: 'test@example.com',
        variables: {},
      },
    };

    await expect(service.sendNotification(input)).rejects.toThrow(
      'Template not found',
    );
  });

  /*** 3️⃣ Ошибка: Неверная стратегия ***/
  it('should throw an error on unknown notification strategy', async () => {
    const input: SendNotificationInput = {
      strategy: 'Unknown' as NotificationStrategy,
      language: Languages.en,
      options: {} as any,
    };

    await expect(service.sendNotification(input)).rejects.toThrow();
  });
});
