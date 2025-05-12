import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_PROVIDER_TOKEN } from './database-provider-token.const';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Role } from '../roles/infrastructure/database/postgres/entities/role.entity';
import { Privilege } from '../privileges/infrastructure/database/postgres/entities/privilege.entity';
import { RoleVersion } from '../roles/infrastructure/database/postgres/entities/role-version.entity';
import { PrivilegeVersion } from '../privileges/infrastructure/database/postgres/entities/privilege-version.entity';

export const databaseProviders = [
  {
    isGlobal: true,
    imports: [ConfigModule],
    provide: DATABASE_PROVIDER_TOKEN,
    useFactory: async (cfg: ConfigService) => {
      return new DataSource({
        type: 'postgres',
        url: cfg.get('POSTGRES_URL'),
        entities: [Role, Privilege, RoleVersion, PrivilegeVersion],
        synchronize: true,
        logging: true,
      } as PostgresConnectionOptions)
        .initialize()
        .then(async (dataSource) => {
          await dataSource.transaction(async (em) => {
            await em.query(`
            DO $$
                BEGIN
                  IF NOT EXISTS (
                    SELECT 1
                    FROM pg_matviews
                    WHERE matviewname = 'role_hierarchy'
                  ) THEN
                    EXECUTE $view$
                      CREATE MATERIALIZED VIEW role_hierarchy AS
                      WITH RECURSIVE descendants AS (
                        SELECT
                          id AS root_id,
                          id AS related_id,
                          'self' AS direction
                        FROM roles
                
                        UNION ALL
                
                        SELECT
                          d.root_id,
                          r.id AS related_id,
                          'descendant' AS direction
                        FROM descendants d
                        JOIN roles r ON r.parent_id = d.related_id
                      ),
                      ancestors AS (
                        SELECT
                          id AS root_id,
                          id AS related_id,
                          'self' AS direction
                        FROM roles
                
                        UNION ALL
                
                        SELECT
                          a.root_id,
                          r.parent_id AS related_id,
                          'ancestor' AS direction
                        FROM ancestors a
                        JOIN roles r ON r.id = a.related_id
                        WHERE r.parent_id IS NOT NULL
                      )
                
                      SELECT * FROM descendants WHERE direction != 'self'
                      UNION
                      SELECT * FROM ancestors WHERE direction != 'self';
                    $view$;
                  END IF;
                END$$;
          `);
          });

          return dataSource;
        });
    },
    inject: [ConfigService],
  },
];
