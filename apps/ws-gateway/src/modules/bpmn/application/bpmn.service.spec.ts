import { Test, TestingModule } from '@nestjs/testing';
import { BpmnService } from './bpmn.service';

describe('BpmnService', () => {
  let service: BpmnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BpmnService],
    }).compile();

    service = module.get<BpmnService>(BpmnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
