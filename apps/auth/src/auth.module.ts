import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule, JwtAuthModule } from '@app/common';
import { AuthGrpcController } from './auth.grpc.controller';
import { GrpcModule } from '@app/common/grpc';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
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
        entities: [User],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    GrpcModule.forFeature(
      'localhost:50051',
      'auth',
      join(__dirname, './auth.proto'),
    ),
    JwtAuthModule,
    UsersModule,
    LoggerModule.forRoot(),
    DatabaseModule,
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
