import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../application/tasks.service';
import { GrpcTasksController } from './grpc.tasks.controller';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';
import { TASK_REPOSITORY_TOKEN } from '../../domain/repository/task.repository.token';

describe('RmqTasksController', () => {
  let controller: GrpcTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcTasksController],
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

    controller = module.get<GrpcTasksController>(GrpcTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
