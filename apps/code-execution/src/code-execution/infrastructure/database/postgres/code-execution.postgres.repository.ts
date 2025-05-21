import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CodeExecutionHistory } from './entities/code-execution-history.entity';
import { CreateCodeExecutionHistory } from '../../../domain/types/create-code-execution-history';
import { FindExecutionHistoryFilter } from '../../../domain/types/find-execution-history-filter';
import { CodeExecutionRepository } from '../../../domain/code-execution.repository';

@Injectable()
export class CodeExecutionPostgresRepository
  implements CodeExecutionRepository
{
  constructor(
    private readonly codeExecutionHistoryRepository: Repository<CodeExecutionHistory>,
  ) {}

  async create(createCodeExecutionHistory: CreateCodeExecutionHistory) {
    return this.codeExecutionHistoryRepository.save({
      ...createCodeExecutionHistory,
      script: { id: createCodeExecutionHistory.scriptId },
    });
  }

  async findAll(filter: FindExecutionHistoryFilter) {
    return this.codeExecutionHistoryRepository.find({
      where: {
        tenantId: filter.tenantId,
        script: { id: filter.scriptId },
        userId: filter.userId,
      },
    });
  }

  async findOneById(id: string) {
    return this.codeExecutionHistoryRepository.findOne({
      where: { id },
      relations: ['script'],
    });
  }
}
