import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_PROVIDER_TOKEN } from './database-provider-token.const';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { File } from '../files/infrastructure/database/postgres/entities/file.entity';
import { Document } from '../documents/infrastructure/database/postgres/entities/document.entity';
import { DocumentPermissions } from '../documents/infrastructure/database/postgres/entities/document-permissions.entity';
import { DocumentVersions } from '../documents/infrastructure/database/postgres/entities/document-versions.entity';

export const databaseProviders = [
  {
    isGlobal: true,
    imports: [ConfigModule],
    provide: DATABASE_PROVIDER_TOKEN,
    useFactory: async (cfg: ConfigService) => {
      return new DataSource({
        type: 'postgres',
        url: cfg.get('POSTGRES_URL'),
        entities: [File, Document, DocumentPermissions, DocumentVersions],
        synchronize: true,
        logging: true,
        migrations: ['dist/apps/file-management/src/migrations/*.js'],
        migrationsRun: true,
      } as PostgresConnectionOptions).initialize();
    },
    inject: [ConfigService],
  },
];
