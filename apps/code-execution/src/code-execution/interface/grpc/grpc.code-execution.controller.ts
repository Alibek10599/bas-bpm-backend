import { Controller } from '@nestjs/common';
import { CodeExecutionService } from '../../application/code-execution.service';

@Controller()
export class GrpcCodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}
}
