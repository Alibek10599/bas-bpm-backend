import { Test, TestingModule } from '@nestjs/testing';
import { GrpcFilesController } from './grpc.files.controller';
import { FilesService } from '../../application/files.service';

describe('FilesController', () => {
  let controller: GrpcFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcFilesController],
      providers: [FilesService],
    }).compile();

    controller = module.get<GrpcFilesController>(GrpcFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
