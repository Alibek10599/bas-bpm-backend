import { Test, TestingModule } from '@nestjs/testing';
import { GrpcNotificationController } from './grpc.notification.controller';
import { NotificationsService } from '../../application/notifications.service';
import { SendNotificationsEnumInterceptor } from './interceptors/send-notifications-enums.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { NotificationStrategy } from '../../application/enums/notification-strategies.enum';
import { EmailTemplatesEnum } from '../../../templates/shared/enums/email.templates.enum';
import { Languages } from '../../../shared/languages/languages.enum';

describe('GrpcNotificationController', () => {
  let controller: GrpcNotificationController;
  let notificationService: NotificationsService;
  let interceptor: SendNotificationsEnumInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcNotificationController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            sendNotification: jest.fn().mockResolvedValue({ status: 'OK' }),
          },
        },
        SendNotificationsEnumInterceptor,
      ],
    }).compile();

    controller = module.get<GrpcNotificationController>(
      GrpcNotificationController,
    );
    notificationService =
      module.get<NotificationsService>(NotificationsService);
    interceptor = module.get<SendNotificationsEnumInterceptor>(
      SendNotificationsEnumInterceptor,
    );
  });

  it('should call the interceptor before handling the request', async () => {
    const mockExecutionContext = {
      switchToRpc: () => ({
        getData: () => ({
          strategy: 1,
          language: 1,
          options: {
            receiverEmail: 'test@example.com',
            variables: {},
            templateId: 1,
          },
        }),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: jest.fn(() => of({ status: 'OK' })),
    };

    // Spy on intercept method
    const interceptSpy = jest.spyOn(interceptor, 'intercept');

    await interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .toPromise();

    expect(interceptSpy).toHaveBeenCalled();
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });

  it('should call sendNotification method from NotificationsService', async () => {
    const mockDto = {
      strategy: NotificationStrategy.Email,
      language: Languages.en,
      options: {
        receiverEmail: 'test@example.com',
        variables: {},
        templateId: EmailTemplatesEnum.WELCOME,
      },
    };

    const result = await controller.sendNotification(mockDto);

    expect(notificationService.sendNotification).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual({ status: 'OK' });
  });
});
