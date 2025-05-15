import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_PROVIDER_TOKEN } from './database-provider-token.const';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Reference } from '../references/infrastructure/database/postgres/entities/reference.entity';
import { ReferenceData } from '../references/infrastructure/database/postgres/entities/reference-data.entity';
import { ReferenceVersions } from '../references/infrastructure/database/postgres/entities/reference-version.entity';

export const databaseProviders = [
  {
    isGlobal: true,
    imports: [ConfigModule],
    provide: DATABASE_PROVIDER_TOKEN,
    useFactory: async (cfg: ConfigService) => {
      return new DataSource({
        type: 'postgres',
        url: cfg.get('POSTGRES_URL'),
        entities: [Reference, ReferenceData, ReferenceVersions],
        synchronize: true,
        logging: true,
        migrations: ['dist/apps/references/src/migrations/*.js'],
        migrationsRun: true,
      } as PostgresConnectionOptions).initialize();
    },
    inject: [ConfigService],
  },
];
