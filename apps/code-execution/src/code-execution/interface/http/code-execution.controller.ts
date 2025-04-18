import { Body, Controller, Post } from '@nestjs/common';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { CodeExecutionService } from '../../application/code-execution.service';
import { CurrentUser } from '@app/common';

@Controller('code-execution')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Post('/execute')
  async executeScript(
    @CurrentUser() user: any,
    @Body() executeScriptDto: ExecuteScriptDto,
  ) {
    return await this.codeExecutionService.executeScript({
      ...executeScriptDto,
      tenantId: user.tenantId,
      userId: user.userId,
    });
  }
}
