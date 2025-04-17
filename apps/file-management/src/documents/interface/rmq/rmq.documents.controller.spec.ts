import { Test, TestingModule } from '@nestjs/testing';
import { RmqDocumentsController } from './rmq.documents.controller';
import { DocumentsService } from '../../application/documents.service';

describe('RmqDocumentsController', () => {
  let controller: RmqDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqDocumentsController],
      providers: [DocumentsService],
    }).compile();

    controller = module.get<RmqDocumentsController>(RmqDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
