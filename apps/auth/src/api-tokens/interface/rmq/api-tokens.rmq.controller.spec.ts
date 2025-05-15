import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokensService } from '../../application/api-tokens.service';
import { ApiTokensRmqController } from './api-tokens.rmq.controller';
import { API_TOKENS_REPOSITORY } from '../../domain/repository/api-tokens.repository.token';

describe('ApiTokensRmqController', () => {
  let controller: ApiTokensRmqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTokensRmqController],
      providers: [
        {
          provide: API_TOKENS_REPOSITORY,
          useValue: {},
        },
        ApiTokensService,
      ],
    }).compile();

    controller = module.get<ApiTokensRmqController>(ApiTokensRmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
