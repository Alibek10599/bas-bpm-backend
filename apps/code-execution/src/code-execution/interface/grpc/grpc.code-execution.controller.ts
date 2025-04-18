import { Body, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CodeExecutionService } from '../../application/code-execution.service';
import { CurrentUser } from '@app/common';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { CodeExecutionHistoryFilterDto } from '../dto/code-execution-history-filter.dto';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { MessageMetadata } from '../dto/message.metadata';
import { ProgrammingLanguageEnumInterceptor } from '../../../scripts/interface/grpc/interceptors/programming-language-enum.interceptor';

@Controller()
export class GrpcCodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @UseInterceptors(ProgrammingLanguageEnumInterceptor)
  @GrpcMethod('CodeExecution', 'Execute')
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

  @GrpcMethod('CodeExecution', 'GetHistory')
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
