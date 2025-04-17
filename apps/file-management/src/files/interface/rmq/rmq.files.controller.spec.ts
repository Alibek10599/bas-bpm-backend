import { Test, TestingModule } from '@nestjs/testing';
import { RmqFilesController } from './rmq.files.controller';
import { FilesService } from '../../application/files.service';

describe('FilesController', () => {
  let controller: RmqFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqFilesController],
      providers: [FilesService],
    }).compile();

    controller = module.get<RmqFilesController>(RmqFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
