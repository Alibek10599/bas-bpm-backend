import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from '../../application/references.service';
import { RmqReferencesController } from './rmq.references.controller';

describe('RmqReferencesController', () => {
  let controller: RmqReferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqReferencesController],
      providers: [ReferencesService],
    }).compile();

    controller = module.get<RmqReferencesController>(RmqReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
