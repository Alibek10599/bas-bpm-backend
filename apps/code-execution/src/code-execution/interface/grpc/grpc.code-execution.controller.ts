import { Controller } from '@nestjs/common';
import { CodeExecutionService } from '../../application/code-execution.service';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { CodeExecutionHistoryFilterDto } from '../dto/code-execution-history-filter.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { MessageMetadata } from '../dto/message.metadata';

@Controller()
export class GrpcCodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @GrpcMethod('CodeExecutionService', 'Execute')
  async executeScript(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') executeScriptDto: ExecuteScriptDto,
  ) {
    return await this.codeExecutionService.executeScript({
      ...executeScriptDto,
      tenantId: metadata?.tenantId ?? '',
      userId: metadata?.userId ?? '',
    });
  }

  @GrpcMethod('CodeExecutionService', 'GetHistory')
  async getCodeExecutionHistory(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') codeExecutionHistoryFilter: CodeExecutionHistoryFilterDto,
  ) {
    const result = await this.codeExecutionService.getCodeExecutionHistory({
      scriptId: codeExecutionHistoryFilter.scriptId,
      userId: codeExecutionHistoryFilter.userId,
      tenantId: metadata.tenantId,
    });
    return {
      items: result,
    };
  }
}
