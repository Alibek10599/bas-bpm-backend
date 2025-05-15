import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokensGrpcController } from './api-tokens.grpc.controller';
import { ApiTokensService } from '../../application/api-tokens.service';
import { API_TOKENS_REPOSITORY } from '../../domain/repository/api-tokens.repository.token';

describe('ApiTokensGrpcController', () => {
  let controller: ApiTokensGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTokensGrpcController],
      providers: [
        {
          provide: API_TOKENS_REPOSITORY,
          useValue: {},
        },
        ApiTokensService,
      ],
    }).compile();

    controller = module.get<ApiTokensGrpcController>(ApiTokensGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
