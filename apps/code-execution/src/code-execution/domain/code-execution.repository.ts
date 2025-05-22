import { CodeExecutionHistory } from '../infrastructure/database/postgres/entities/code-execution-history.entity';
import { CreateCodeExecutionHistory } from './types/create-code-execution-history';
import { FindExecutionHistoryFilter } from './types/find-execution-history-filter';

export interface CodeExecutionRepository {
  findOneById(id: string): Promise<CodeExecutionHistory>;
  findAll(filter: FindExecutionHistoryFilter): Promise<CodeExecutionHistory[]>;
  create(
    createCodeExecutionHistory: CreateCodeExecutionHistory,
  ): Promise<CodeExecutionHistory>;
}
