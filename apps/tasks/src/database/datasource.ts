import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Task } from '../tasks/infrastructure/database/postgres/entities/task';
import { TaskVersion } from '../tasks-versions/infrastructure/database/postgres/entities/task-version.entity';
import { TaskDelegation } from '../tasks-delegations/infrastructure/database/postgres/entities/task-delegation';

config({ path: './apps/tasks/.env' });

export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [Task, TaskVersion, TaskDelegation],
  migrations: ['dist/apps/tasks/src/migrations/*.js'],
  migrationsRun: true,
});
