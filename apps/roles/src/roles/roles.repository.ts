import { Provider } from '@nestjs/common';
import { ROLE_REPOSITORY_TOKEN } from './domain/repository/roles.repository.token';
import { DataSource } from 'typeorm';
import { Role } from './infrastructure/database/postgres/entities/role.entity';
import { RolesPostgresRepository } from './infrastructure/database/postgres/roles.postgres.repository';
import { DATABASE_PROVIDER_TOKEN } from '../database/database-provider-token.const';

export const rolesRepository: Provider[] = [
  {
    provide: ROLE_REPOSITORY_TOKEN,
    inject: [DATABASE_PROVIDER_TOKEN],
    useFactory: (dataSource: DataSource) =>
      new RolesPostgresRepository(dataSource.getRepository(Role), dataSource),
  },
];
