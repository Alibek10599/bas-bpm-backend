import { Test, TestingModule } from '@nestjs/testing';
import { ReferencesController } from './references.controller';
import { ReferencesService } from '../../application/references.service';
import { REFERENCES_REPOSITORY_TOKEN } from '../../domain/repository/references.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../database/database-provider-token.const';

describe('ReferencesController', () => {
  let controller: ReferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferencesController],
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

    controller = module.get<ReferencesController>(ReferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
