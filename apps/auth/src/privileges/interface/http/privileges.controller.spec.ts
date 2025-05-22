import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from '../../application/privileges.service';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../../domain/repository/privileges.repository.token';
import { DataSource } from 'typeorm';

describe('PrivilegesController', () => {
  let controller: PrivilegesController;

  beforeEach(async () => {
    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegesController],
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

    controller = module.get<PrivilegesController>(PrivilegesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
