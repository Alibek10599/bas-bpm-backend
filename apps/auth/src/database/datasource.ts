import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/user.entity';

config({ path: './apps/auth/.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  migrations: ['dist/apps/auth/src/migrations/*.js'],
  migrationsRun: true,
});
