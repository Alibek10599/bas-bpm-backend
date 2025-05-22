import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesRmqController } from './privileges.rmq.controller';
import { PrivilegesService } from '../../application/privileges.service';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../../domain/repository/privileges.repository.token';
import { DataSource } from 'typeorm';

describe('PrivilegesRmqController', () => {
  let controller: PrivilegesRmqController;

  beforeEach(async () => {
    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegesRmqController],
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

    controller = module.get<PrivilegesRmqController>(PrivilegesRmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
