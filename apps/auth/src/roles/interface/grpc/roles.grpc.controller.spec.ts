import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../application/roles.service';
import { RolesGrpcController } from './roles.grpc.controller';
import { ROLE_REPOSITORY_TOKEN } from '../../domain/repository/roles.repository.token';

describe('RolesGrpcController', () => {
  let controller: RolesGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesGrpcController],
      providers: [
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {},
        },
        RolesService,
      ],
    }).compile();

    controller = module.get<RolesGrpcController>(RolesGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
