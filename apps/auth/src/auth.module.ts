import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '@app/common';
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
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().exist(),
        JWT_EXPIRATION_TIME: Joi.number(),
        POSTGRES_URL: Joi.string().exist(),
        RABBITMQ_URLS: Joi.string().exist(),
        RABBITMQ_QUEUE: Joi.string().exist(),
        HTTP_PORT: Joi.number().exist(),
        GRPC_URL: Joi.string().exist(),
        LOGGER_LEVEL: Joi.string(),
        LOGGER_PRETTY: Joi.boolean(),
        BYPASS_PERMISSIONS: Joi.boolean(),
      }),
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    LoggerModule,
    JwtModule.registerAsync({
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('POSTGRES_URL'),
        entities: [
          User,
          Role,
          RoleVersion,
          Privilege,
          PrivilegeVersion,
          ApiToken,
        ],
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
    ApiTokensModule,
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService],
})
export class AuthModule {}
