import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Reference } from '../references/infrastructure/database/postgres/entities/reference.entity';
import { ReferenceData } from '../references/infrastructure/database/postgres/entities/reference-data.entity';
import { ReferenceVersions } from '../references/infrastructure/database/postgres/entities/reference-version.entity';

config({ path: './apps/references/.env' });

export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [Reference, ReferenceData, ReferenceVersions],
  migrations: ['dist/apps/references/src/migrations/*.js'],
  migrationsRun: true,
});
