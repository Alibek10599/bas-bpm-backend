import { Test, TestingModule } from '@nestjs/testing';
import { RmqDocumentsController } from './rmq.documents.controller';
import { DocumentsService } from '../../application/documents.service';
import { FilesService } from '../../../files/application/files.service';
import { DOCUMENT_REPOSITORY_TOKEN } from '../../domain/repository/document.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';

describe('RmqDocumentsController', () => {
  let controller: RmqDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqDocumentsController],
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

    controller = module.get<RmqDocumentsController>(RmqDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
