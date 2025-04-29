import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_PROVIDER_TOKEN } from './database-provider-token.const';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../src/users/user.entity';

export const databaseProviders = [
  {
    isGlobal: true,
    imports: [ConfigModule],
    provide: DATABASE_PROVIDER_TOKEN,
    useFactory: async (cfg: ConfigService) => {
      return new DataSource({
        type: 'postgres',
        url: cfg.get('POSTGRES_URL'),
        entities: [User],
        synchronize: true,
        logging: true,
      } as PostgresConnectionOptions).initialize();
    },
    inject: [ConfigService],
  },
];
