import { Test, TestingModule } from '@nestjs/testing';
import { GrpcCodeExecutionController } from './grpc.code-execution.controller';
import { CodeExecutionService } from '../../application/code-execution.service';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { MessageMetadata } from '../dto/message.metadata';
import { CodeExecutionHistoryFilterDto } from '../dto/code-execution-history-filter.dto';

jest.mock('isolated-vm', () => ({
  Isolate: jest.fn(),
}));

describe('GrpcCodeExecutionController', () => {
  let controller: GrpcCodeExecutionController;
  let codeExecutionService: CodeExecutionService;

  const mockCodeExecutionService = {
    executeScript: jest.fn(),
    getCodeExecutionHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrpcCodeExecutionController],
      providers: [
        {
          provide: CodeExecutionService,
          useValue: mockCodeExecutionService,
        },
      ],
    }).compile();

    controller = module.get<GrpcCodeExecutionController>(
      GrpcCodeExecutionController,
    );
    codeExecutionService =
      module.get<CodeExecutionService>(CodeExecutionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('executeScript', () => {
    it('should call CodeExecutionService.executeScript with correct parameters', async () => {
      const metadata: MessageMetadata = {
        tenantId: 'tenant1',
        userId: 'user1',
      };
      const executeScriptDto: ExecuteScriptDto = {
        scriptId: '1',
        context: {},
      };

      await controller.executeScript(metadata, executeScriptDto);

      expect(codeExecutionService.executeScript).toHaveBeenCalledWith({
        ...executeScriptDto,
        tenantId: metadata.tenantId,
        userId: metadata.userId,
      });
    });
  });

  describe('getCodeExecutionHistory', () => {
    it('should call CodeExecutionService.getCodeExecutionHistory with correct parameters', async () => {
      const metadata: MessageMetadata = {
        tenantId: 'tenant1',
        userId: 'user1',
      };
      const historyFilter: CodeExecutionHistoryFilterDto = {
        scriptId: '123',
        userId: 'user1',
      };

      await controller.getCodeExecutionHistory(metadata, historyFilter);

      expect(codeExecutionService.getCodeExecutionHistory).toHaveBeenCalledWith(
        {
          scriptId: historyFilter.scriptId,
          userId: historyFilter.userId,
          tenantId: metadata.tenantId,
        },
      );
    });
  });
});
