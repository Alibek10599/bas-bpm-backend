import { Controller } from '@nestjs/common';
import { CodeExecutionService } from '../../application/code-execution.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { MessageMetadata } from '../dto/message.metadata';
import { CodeExecutionHistoryFilterDto } from '../dto/code-execution-history-filter.dto';

@Controller()
export class RmqCodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @MessagePattern('code-execution.execute')
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

  @MessagePattern('code-execution.history')
  async getCodeExecutionHistory(
    @Payload('metadata') metadata: MessageMetadata,
    @Payload('body') codeExecutionHistoryFilter: CodeExecutionHistoryFilterDto,
  ) {
    return await this.codeExecutionService.getCodeExecutionHistory({
      scriptId: codeExecutionHistoryFilter.scriptId,
      userId: codeExecutionHistoryFilter.userId,
      tenantId: metadata.tenantId,
    });
  }
}
