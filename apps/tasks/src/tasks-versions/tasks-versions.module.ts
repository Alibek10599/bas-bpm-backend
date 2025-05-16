import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TaskVersion } from './infrastructure/database/postgres/entities/task-version.entity';
import { Task } from '../tasks/infrastructure/database/postgres/entities/task';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'TASK_VERSIONS_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(TaskVersion),
      inject: [DATABASE_PROVIDER_TOKEN],
    },
  ],
  exports: ['TASK_VERSIONS_REPOSITORY'],
})
export class TasksVersionsModule {}
