import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../application/tasks.service';
import { RmqTasksController } from './rmq.tasks.controller';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';
import { TASK_REPOSITORY_TOKEN } from '../../domain/repository/task.repository.token';

describe('RmqTasksController', () => {
  let controller: RmqTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqTasksController],
      providers: [
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: {},
        },
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {},
        },
        TasksService,
      ],
    }).compile();

    controller = module.get<RmqTasksController>(RmqTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
