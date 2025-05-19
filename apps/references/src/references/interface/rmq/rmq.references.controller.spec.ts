import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesService } from '../../application/references.service';
import { RmqReferencesController } from './rmq.references.controller';
import { REFERENCES_REPOSITORY_TOKEN } from '../../domain/repository/references.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';

describe('RmqReferencesController', () => {
  let controller: RmqReferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmqReferencesController],
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

    controller = module.get<RmqReferencesController>(RmqReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
