import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from '../../application/tasks.service';
import { TASK_REPOSITORY_TOKEN } from '../../domain/repository/task.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
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

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
