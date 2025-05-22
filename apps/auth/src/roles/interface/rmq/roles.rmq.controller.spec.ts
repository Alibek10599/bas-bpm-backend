import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../application/roles.service';
import { RolesRmqController } from './roles.rmq.controller';
import { ROLE_REPOSITORY_TOKEN } from '../../domain/repository/roles.repository.token';

describe('RolesRmqController', () => {
  let controller: RolesRmqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesRmqController],
      providers: [
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {},
        },
        RolesService,
      ],
    }).compile();

    controller = module.get<RolesRmqController>(RolesRmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
