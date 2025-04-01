import { Test, TestingModule } from '@nestjs/testing';
import { BpmnGateway } from './bpmn.gateway';
import { BpmnService } from './bpmn.service';

describe('BpmnGateway', () => {
  let gateway: BpmnGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BpmnGateway, BpmnService],
    }).compile();

    gateway = module.get<BpmnGateway>(BpmnGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
