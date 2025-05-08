import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegesService } from '../../application/privileges.service';
import { PrivilegesGrpcController } from './privileges.grpc.controller';

describe('PrivilegesGrpcController', () => {
  let controller: PrivilegesGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegesGrpcController],
      providers: [PrivilegesService],
    }).compile();

    controller = module.get<PrivilegesGrpcController>(PrivilegesGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
