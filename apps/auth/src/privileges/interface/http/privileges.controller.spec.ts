import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from '../../application/privileges.service';
import { PRIVILEGES_REPOSITORY_TOKEN } from '../../domain/repository/privileges.repository.token';

describe('PrivilegesController', () => {
  let controller: PrivilegesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegesController],
      providers: [
        {
          provide: PRIVILEGES_REPOSITORY_TOKEN,
          useValue: {},
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
