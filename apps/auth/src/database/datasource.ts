import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/user.entity';
import { Role } from '../roles/infrastructure/database/postgres/entities/role.entity';
import { RoleVersion } from '../roles/infrastructure/database/postgres/entities/role-version.entity';
import { Privilege } from '../privileges/infrastructure/database/postgres/entities/privilege.entity';
import { PrivilegeVersion } from '../privileges/infrastructure/database/postgres/entities/privilege-version.entity';
import { ApiToken } from '../api-tokens/infrastructure/database/postgres/entities/api-token.entity';
import { Migration1747815153949 } from '../migrations/1747815153949-CreateMaterializedView';

config({ path: './apps/auth/.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Role, RoleVersion, Privilege, PrivilegeVersion, ApiToken],
  migrations: [Migration1747815153949],
  migrationsRun: true,
});
