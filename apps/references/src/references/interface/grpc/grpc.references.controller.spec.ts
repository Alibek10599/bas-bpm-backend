import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from '../../application/references.service';
import { GrpcReferencesController } from './grpc.references.controller';

describe('GrpcReferencesController', () => {
  let controller: GrpcReferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcReferencesController],
      providers: [ReferencesService],
    }).compile();

    controller = module.get<GrpcReferencesController>(GrpcReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
