import { Test, TestingModule } from '@nestjs/testing';
import { notificationsService } from './notifications.service';

describe('notificationsService', () => {
  let service: notificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [notificationsService],
    }).compile();

    service = module.get<notificationsService>(notificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
