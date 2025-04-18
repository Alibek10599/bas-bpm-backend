import { Inject, Injectable } from '@nestjs/common';
import * as ivm from 'isolated-vm';
import { ScriptsService } from '../../scripts/application/scripts.service';
import { ExecuteScriptInput } from '../domain/types/execute-script.input';
import { ExecuteScriptOutput } from '../domain/types/execute-script.output';
import { CodeExecutionRepositoryToken } from '../domain/code-execution.repository.token';
import { CodeExecutionRepository } from '../domain/code-execution.repository';

@Injectable()
export class CodeExecutionService {
  constructor(
    private readonly scriptsService: ScriptsService,
    @Inject(CodeExecutionRepositoryToken)
    private readonly codeExecutionRepository: CodeExecutionRepository,
  ) {}

  async executeScript(
    executeScriptInput: ExecuteScriptInput,
  ): Promise<ExecuteScriptOutput> {
    const script = await this.scriptsService.findOne(
      executeScriptInput.scriptId,
    );

    const isolate = new ivm.Isolate({ memoryLimit: 64 });

    const context = await isolate.createContext();
    const jail = context.global;

    await jail.set('global', jail.derefInto());
    await jail.set(
      'data',
      new ivm.ExternalCopy(executeScriptInput.context).copyInto(),
    );
    await jail.set(
      'userId',
      new ivm.ExternalCopy(executeScriptInput.userId).copyInto(),
    );
    await jail.set(
      'tenantId',
      new ivm.ExternalCopy(executeScriptInput.tenantId).copyInto(),
    );

    const compiledScript = await isolate.compileScript(script.script);
    const startDate = +new Date();
    const result = await compiledScript.run(context, { timeout: 10000 });

    await this.codeExecutionRepository.create({
      scriptId: script.id,
      execution_time_ms: +new Date() - startDate,
      result: result,
      tenantId: executeScriptInput.tenantId,
      userId: executeScriptInput.userId,
    });
    return { scriptId: script.id, status: 'OK' };
  }
}
