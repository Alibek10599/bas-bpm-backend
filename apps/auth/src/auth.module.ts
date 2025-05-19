import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from '@app/common';
import { AuthGrpcController } from './auth.grpc.controller';
import { RolesModule } from './roles/roles.module';
import { PrivilegesModule } from './privileges/privileges.module';
import { AccessRedisModule } from '@app/common/redis/accesses-redis';
import { JwtAuthModule } from '@app/common/auth';
import { RoleVersion } from './roles/infrastructure/database/postgres/entities/role-version.entity';
import { Role } from './roles/infrastructure/database/postgres/entities/role.entity';
import { Privilege } from './privileges/infrastructure/database/postgres/entities/privilege.entity';
import { PrivilegeVersion } from './privileges/infrastructure/database/postgres/entities/privilege-version.entity';
import { ApiTokensModule } from './api-tokens/api-tokens.module';
import { ApiToken } from './api-tokens/infrastructure/database/postgres/entities/api-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (cfg: ConfigService) => {
        return {
          secret: cfg.get<string>('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          User,
          Role,
          RoleVersion,
          Privilege,
          PrivilegeVersion,
          ApiToken,
        ],
        //synchronize: configService.get('NODE_ENV') !== 'production',
        synchronize: true,
        migrations: ['dist/apps/auth/src/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    AccessRedisModule,
    JwtAuthModule,
    RolesModule,
    PrivilegesModule,
    UsersModule,
    LoggerModule.forRoot(),
    DatabaseModule,
    ApiTokensModule,
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService],
})
export class AuthModule {}
