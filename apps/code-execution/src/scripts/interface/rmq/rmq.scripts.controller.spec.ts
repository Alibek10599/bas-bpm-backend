import { Test, TestingModule } from '@nestjs/testing';
import { RmqScriptsController } from './rmq.scripts.controller';
import { ScriptsService } from '../../application/scripts.service';

describe('CodeExecutionController', () => {
  let controller: RmqScriptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqScriptsController],
      providers: [ScriptsService],
    }).compile();

    controller = module.get<RmqScriptsController>(RmqScriptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
