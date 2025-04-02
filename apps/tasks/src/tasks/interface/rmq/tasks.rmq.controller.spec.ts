import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../application/tasks.service';
import { RmqTasksController } from './rmq.tasks.controller';

describe('RmqTasksController', () => {
  let controller: RmqTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqTasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<RmqTasksController>(RmqTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
