import { Provider } from '@nestjs/common';
import { ROLE_REPOSITORY_TOKEN } from './domain/repository/roles.repository.token';
import { DATABASE_PROVIDER_TOKEN } from '../../../tasks/src/database/database-provider-token.const';
import { DataSource } from 'typeorm';
import { Role } from './infrastructure/database/postgres/entities/role.entity';
import { RolesPostgresRepository } from './infrastructure/database/postgres/roles.postgres.repository';

export const rolesRepository: Provider[] = [
  {
    provide: ROLE_REPOSITORY_TOKEN,
    inject: [DATABASE_PROVIDER_TOKEN],
    useFactory: (dataSource: DataSource) =>
      new RolesPostgresRepository(dataSource.getRepository(Role), dataSource),
  },
];
