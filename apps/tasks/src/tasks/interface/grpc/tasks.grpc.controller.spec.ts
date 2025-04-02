import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../application/tasks.service';
import { GrpcTasksController } from './grpc.tasks.controller';

describe('RmqTasksController', () => {
  let controller: GrpcTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcTasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<GrpcTasksController>(GrpcTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
