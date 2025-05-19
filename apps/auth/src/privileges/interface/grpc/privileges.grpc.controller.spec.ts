import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesService } from '../../application/privileges.service';
import { PrivilegesGrpcController } from './privileges.grpc.controller';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../../domain/repository/privileges.repository.token';
import { DataSource } from 'typeorm';

describe('PrivilegesGrpcController', () => {
  let controller: PrivilegesGrpcController;

  beforeEach(async () => {
    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegesGrpcController],
      providers: [
        {
          provide: PRIVILEGES_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        PrivilegesService,
      ],
    }).compile();

    controller = module.get<PrivilegesGrpcController>(PrivilegesGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
