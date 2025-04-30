import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../application/roles.service';
import { RolesRmqController } from './roles.rmq.controller';

describe('RolesRmqController', () => {
  let controller: RolesRmqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesRmqController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesRmqController>(RolesRmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
