import { DataSource } from 'typeorm';
import { TasksPostgresRepository } from './infrastructure/database/postgres/tasks.postgres.repository';
import { TaskEntity } from './infrastructure/database/postgres/entities/task.entity';
import { TASK_REPOSITORY_TOKEN } from './domain/repository/task.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';

export const tasksRepository = {
  inject: [DATABASE_PROVIDER_TOKEN],
  useFactory: (dataSource: DataSource) =>
    new TasksPostgresRepository(
      dataSource.getRepository(TaskEntity),
      dataSource,
    ),
  provide: TASK_REPOSITORY_TOKEN,
};
