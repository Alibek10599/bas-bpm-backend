import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesRmqController } from './privileges.rmq.controller';
import { PrivilegesService } from '../../application/privileges.service';

describe('PrivilegesRmqController', () => {
  let controller: PrivilegesRmqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegesRmqController],
      providers: [PrivilegesService],
    }).compile();

    controller = module.get<PrivilegesRmqController>(PrivilegesRmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
