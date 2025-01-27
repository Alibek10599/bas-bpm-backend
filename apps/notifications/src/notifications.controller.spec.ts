import { Test, TestingModule } from '@nestjs/testing';
import { notificationsController } from './notifications.controller';
import { notificationsService } from './notifications.service';

describe('notificationsController', () => {
  let controller: notificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [notificationsController],
      providers: [notificationsService],
    }).compile();

    controller = module.get<notificationsController>(notificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
