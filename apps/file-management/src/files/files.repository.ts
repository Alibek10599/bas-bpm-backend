import { DataSource } from 'typeorm';
import { DocumentsPostgresRepository } from '../documents/infrastructure/database/postgres/documents.postgres.repository';
import { File } from './infrastructure/database/postgres/entities/file.entity';
import { FILES_REPOSITORY_TOKEN } from './domain/repository/files.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';

export const filesRepository = {
  inject: [DATABASE_PROVIDER_TOKEN],
  useFactory: (dataSource: DataSource) =>
    new DocumentsPostgresRepository(dataSource.getRepository(File)),
  provide: FILES_REPOSITORY_TOKEN,
};
