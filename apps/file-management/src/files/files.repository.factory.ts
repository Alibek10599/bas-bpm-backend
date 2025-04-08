import { DataSource } from 'typeorm';
import { File } from './infrastructure/database/postgres/entities/file.entity';
import { FILES_REPOSITORY_TOKEN } from './domain/repository/files.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { FilesPostgresRepository } from './infrastructure/database/postgres/files.postgres.repository';

export const filesRepositoryFactory = {
  inject: [DATABASE_PROVIDER_TOKEN],
  useFactory: (dataSource: DataSource) => {
    return new FilesPostgresRepository(dataSource.getRepository(File));
  },
  provide: FILES_REPOSITORY_TOKEN,
};
