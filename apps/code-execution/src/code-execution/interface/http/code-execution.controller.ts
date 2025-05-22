import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { CodeExecutionService } from '../../application/code-execution.service';
import { AccessGuard, CurrentUser } from '@app/common';
import { CodeExecutionHistoryFilterDto } from '../dto/code-execution-history-filter.dto';
import { AuthGuard } from '@app/common/auth/auth-guard.service';

@Controller('code-execution')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @UseGuards(AuthGuard, AccessGuard(['codeExecution.execution.execute']))
  @Post('/execute')
  async executeScript(
    @CurrentUser() user: any,
    @Body() executeScriptDto: ExecuteScriptDto,
  ) {
    return await this.codeExecutionService.executeScript({
      ...executeScriptDto,
      tenantId: user?.tenantId ?? 'vit',
      userId: user?.userId ?? 'uid-1',
    });
  }

  @UseGuards(
    AuthGuard,
    AccessGuard(['codeExecution.execution.seeExecutionHistory']),
  )
  @Get('/history')
  async getCodeExecutionHistory(
    @CurrentUser() user: any,
    @Query() codeExecutionHistoryFilter: CodeExecutionHistoryFilterDto,
  ) {
    return await this.codeExecutionService.getCodeExecutionHistory({
      scriptId: codeExecutionHistoryFilter.scriptId,
      userId: codeExecutionHistoryFilter.userId,
      tenantId: user.tenantId,
    });
  }
}
