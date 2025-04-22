import { Test, TestingModule } from '@nestjs/testing';
import { RmqFilesController } from './rmq.files.controller';
import { FilesService } from '../../application/files.service';
import { STORAGE_PROVIDER_TOKEN } from '../../infrastructure/storage/providers/storage.provider.token';
import { FILES_REPOSITORY_TOKEN } from '../../domain/repository/files.repository.token';

describe('FilesController', () => {
  let controller: RmqFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqFilesController],
      providers: [
        {
          provide: STORAGE_PROVIDER_TOKEN,
          useValue: {},
        },
        {
          provide: FILES_REPOSITORY_TOKEN,
          useValue: {},
        },
        FilesService,
      ],
    }).compile();

    controller = module.get<RmqFilesController>(RmqFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
