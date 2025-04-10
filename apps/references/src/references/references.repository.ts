import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { REFERENCES_REPOSITORY_TOKEN } from './domain/repository/references.repository.token';
import { ReferencesPostgresRepository } from './infrastructure/database/postgres/ReferencesPostgresRepository';
import { Reference } from './infrastructure/database/postgres/entities/reference.entity';

export const referencesRepository = {
  inject: [DATABASE_PROVIDER_TOKEN],
  useFactory: (dataSource: DataSource) =>
    new ReferencesPostgresRepository(dataSource.getRepository(Reference)),
  provide: REFERENCES_REPOSITORY_TOKEN,
};
