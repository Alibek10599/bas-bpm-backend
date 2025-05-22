import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokensController } from './api-tokens.controller';
import { ApiTokensService } from '../../application/api-tokens.service';
import { API_TOKENS_REPOSITORY } from '../../domain/repository/api-tokens.repository.token';

describe('ApiTokensController', () => {
  let controller: ApiTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTokensController],
      providers: [
        {
          provide: API_TOKENS_REPOSITORY,
          useValue: {},
        },
        ApiTokensService,
      ],
    }).compile();

    controller = module.get<ApiTokensController>(ApiTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
