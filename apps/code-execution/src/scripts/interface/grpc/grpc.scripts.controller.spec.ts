import { Test, TestingModule } from '@nestjs/testing';
import { GrpcScriptsController } from './grpc.scripts.controller';
import { ScriptsService } from '../../application/scripts.service';

describe('CodeExecutionController', () => {
  let controller: GrpcScriptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcScriptsController],
      providers: [ScriptsService],
    }).compile();

    controller = module.get<GrpcScriptsController>(GrpcScriptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
