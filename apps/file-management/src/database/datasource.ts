import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { File } from '../files/infrastructure/database/postgres/entities/file.entity';
import { Document } from '../documents/infrastructure/database/postgres/entities/document.entity';
import { DocumentPermissions } from '../documents/infrastructure/database/postgres/entities/document-permissions.entity';
import { DocumentVersions } from '../documents/infrastructure/database/postgres/entities/document-versions.entity';

config({ path: './apps/file-management/.env' });

export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [File, Document, DocumentPermissions, DocumentVersions],
  migrations: ['dist/apps/file-management/src/migrations/*.js'],
  migrationsRun: true,
});
