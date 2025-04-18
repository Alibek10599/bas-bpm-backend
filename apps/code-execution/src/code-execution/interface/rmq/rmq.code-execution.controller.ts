import { Controller } from '@nestjs/common';
import { CodeExecutionService } from '../../application/code-execution.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExecuteScriptDto } from '../dto/execute-script.dto';

@Controller()
export class RmqCodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @MessagePattern('code-execution.execute')
  async executeScript(@Payload() executeScriptDto: ExecuteScriptDto) {
    return await this.codeExecutionService.executeScript(executeScriptDto);
  }
}
