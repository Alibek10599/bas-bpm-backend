import { Inject, Injectable } from '@nestjs/common';
import * as ivm from 'isolated-vm';
import * as ts from 'typescript';
import { ScriptsService } from '../../scripts/application/scripts.service';
import { ExecuteScriptInput } from '../domain/types/execute-script.input';
import { ExecuteScriptOutput } from '../domain/types/execute-script.output';
import { CodeExecutionRepositoryToken } from '../domain/code-execution.repository.token';
import { CodeExecutionRepository } from '../domain/code-execution.repository';
import { FindExecutionHistoryFilter } from '../domain/types/find-execution-history-filter';
import { Script } from '../../scripts/infrastructure/database/postgres/entities/script.entity';
import { ProgrammingLanguages } from '../../scripts/infrastructure/enums/programming-languages.enum';

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

    if (!script) {
      throw new Error('Script not found');
    }

    const { executionTime, result } = await this.execute(
      executeScriptInput,
      script,
    );

    await this.codeExecutionRepository.create({
      scriptId: script.id,
      execution_time_ms: executionTime,
      result: result,
      tenantId: executeScriptInput.tenantId,
      userId: executeScriptInput.userId,
    });
    return {
      scriptId: script.id,
      message: 'Script executed successfully',
      result,
      executionTime,
    };
  }

  async getCodeExecutionHistory(filter: FindExecutionHistoryFilter) {
    return await this.codeExecutionRepository.findAll(filter);
  }

  private async execute(
    executeScriptInput: ExecuteScriptInput,
    script: Script,
  ) {
    switch (script.language) {
      case ProgrammingLanguages.JS:
      case ProgrammingLanguages.TS:
        return await this.executeJsOrTs(executeScriptInput, script);
      default:
        return await this.executePython(executeScriptInput, script);
    }
  }

  private async executeJsOrTs(
    executeScriptInput: ExecuteScriptInput,
    script: Script,
  ) {
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

    const preparedScript =
      script.language === 'ts' ? ts.transpile(script.script) : script.script;

    const compiledScript = await isolate.compileScript(preparedScript);

    const startDate = +new Date();
    return await compiledScript
      .run(context, { timeout: 10000 })
      .then((result) => {
        return {
          status: 'success',
          data: result,
        };
      })
      .catch((err) => {
        return {
          status: 'error',
          data: {
            message: err.message,
          },
        };
      })
      .then((result: any) => {
        return {
          executionTime: +new Date() - startDate,
          result,
        };
      });
  }

  private async executePython(
    executeScriptInput: ExecuteScriptInput,
    script: Script,
  ) {
    return {
      executionTime: 0,
      result: {
        status: 'error',
        message: {
          message: 'not implemented',
        },
      },
    };
  }
}
