import { Test, TestingModule } from '@nestjs/testing';
import { GrpcDocumentsController } from './grpc.documents.controller';
import { DocumentsService } from '../../application/documents.service';
import { FilesService } from '../../../files/application/files.service';
import { DOCUMENT_REPOSITORY_TOKEN } from '../../domain/repository/document.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';

describe('DocumentsController', () => {
  let controller: GrpcDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcDocumentsController],
      providers: [
        {
          provide: FilesService,
          useValue: {},
        },
        {
          provide: DOCUMENT_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: {},
        },
        DocumentsService,
      ],
    }).compile();

    controller = module.get<GrpcDocumentsController>(GrpcDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
