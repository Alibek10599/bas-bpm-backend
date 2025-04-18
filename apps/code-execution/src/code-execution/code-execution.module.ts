import { Module } from '@nestjs/common';
import { ScriptsModule } from '../scripts/scripts.module';
import { CodeExecutionService } from './application/code-execution.service';
import { CodeExecutionController } from './interface/http/code-execution.controller';
import { RmqCodeExecutionController } from './interface/rmq/rmq.code-execution.controller';
import { GrpcCodeExecutionController } from './interface/grpc/grpc.code-execution.controller';
import { CodeExecutionRepositoryToken } from './domain/code-execution.repository.token';
import { CodeExecutionPostgresRepository } from './infrastructure/database/postgres/code-execution.postgres.repository';
import { DatabaseModule } from '../database/database.module';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { CodeExecutionHistory } from './infrastructure/database/postgres/entities/code-execution-history.entity';

@Module({
  imports: [DatabaseModule, ScriptsModule],
  controllers: [
    CodeExecutionController,
    RmqCodeExecutionController,
    GrpcCodeExecutionController,
  ],
  providers: [
    {
      provide: CodeExecutionRepositoryToken,
      useFactory: (dataSource: DataSource) => {
        return new CodeExecutionPostgresRepository(
          dataSource.getRepository(CodeExecutionHistory),
        );
      },
      inject: [DATABASE_PROVIDER_TOKEN],
    },
    CodeExecutionService,
  ],
})
export class CodeExecutionModule {}
