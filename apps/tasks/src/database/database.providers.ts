import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_PROVIDER_TOKEN } from './database-provider-token.const';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Task } from '../tasks/infrastructure/database/postgres/entities/task';
import { TaskVersion } from '../tasks-versions/infrastructure/database/postgres/entities/task-version.entity';
import { TaskDelegation } from '../tasks-delegations/infrastructure/database/postgres/entities/task-delegation';

export const databaseProviders = [
  {
    isGlobal: true,
    imports: [ConfigModule],
    provide: DATABASE_PROVIDER_TOKEN,
    useFactory: async (cfg: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: cfg.get('POSTGRES_URL'),
        entities: [Task, TaskVersion, TaskDelegation],
        synchronize: true,
        logging: true,
        relationLoadStrategy: 'join',
        migrations: ['dist/apps/*/src/migrations/*.js'],
        migrationsRun: true,
        extra: {
          max: 30,
        },
      } as PostgresConnectionOptions);

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
