import { Test, TestingModule } from '@nestjs/testing';
import { GrpcDocumentsController } from './grpc.documents.controller';
import { DocumentsService } from '../../application/documents.service';

describe('DocumentsController', () => {
  let controller: GrpcDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcDocumentsController],
      providers: [DocumentsService],
    }).compile();

    controller = module.get<GrpcDocumentsController>(GrpcDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
