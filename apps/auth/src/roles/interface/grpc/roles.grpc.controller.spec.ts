import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../application/roles.service';
import { RolesGrpcController } from './roles.grpc.controller';
import { ROLE_REPOSITORY_TOKEN } from '../../domain/repository/roles.repository.token';
import { DataSource } from 'typeorm';

describe('RolesGrpcController', () => {
  let controller: RolesGrpcController;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {
      transaction: jest.fn(),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesGrpcController],
      providers: [
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: dataSource,
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
