import { Provider } from '@nestjs/common';
import { PRIVILEGES_REPOSITORY_TOKEN } from './domain/repository/privileges.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { PrivilegesPostgresRepository } from './infrastructure/database/privileges.postgres.repository';
import { Privilege } from './infrastructure/database/postgres/entities/privilege.entity';

export const privilegesRepository: Provider = {
  provide: PRIVILEGES_REPOSITORY_TOKEN,
  useFactory: (dataSource: DataSource) => {
    return new PrivilegesPostgresRepository(
      dataSource.getRepository(Privilege),
    );
  },
  inject: [DATABASE_PROVIDER_TOKEN],
};
