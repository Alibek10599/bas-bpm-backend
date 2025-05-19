import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from '../../application/references.service';
import { GrpcReferencesController } from './grpc.references.controller';
import { REFERENCES_REPOSITORY_TOKEN } from '../../domain/repository/references.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';

describe('GrpcReferencesController', () => {
  let controller: GrpcReferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcReferencesController],
      providers: [
        {
          provide: REFERENCES_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: DATABASE_PROVIDER_TOKEN,
          useValue: {},
        },
        ReferencesService,
      ],
    }).compile();

    controller = module.get<GrpcReferencesController>(GrpcReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
