import { Test, TestingModule } from '@nestjs/testing';
import { ScriptsController } from './scripts.controller';
import { ScriptsService } from '../../application/scripts.service';

describe('CodeExecutionController', () => {
  let controller: ScriptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScriptsController],
      providers: [ScriptsService],
    }).compile();

    controller = module.get<ScriptsController>(ScriptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
