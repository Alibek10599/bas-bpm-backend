import { DataSource } from 'typeorm';
import { DOCUMENT_REPOSITORY_TOKEN } from './domain/repository/document.repository.token';
import { Document } from './infrastructure/database/postgres/entities/document.entity';
import { DocumentsPostgresRepository } from './infrastructure/database/postgres/documents.postgres.repository';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';

export const documentsRepository = {
  inject: [DATABASE_PROVIDER_TOKEN],
  useFactory: (dataSource: DataSource) =>
    new DocumentsPostgresRepository(dataSource.getRepository(Document)),
  provide: DOCUMENT_REPOSITORY_TOKEN,
};
