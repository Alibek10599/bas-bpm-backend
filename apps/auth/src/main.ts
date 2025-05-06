import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';
import { grpcCfg } from '@app/common/grpc';
import { resolve } from 'path';
import { AUTH_SERVICE_GRPC } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  const grpcUrl = configService.get<string>('GRPC_URL');

  app.connectMicroservice<GrpcOptions>(
    grpcCfg(
      grpcUrl,
      AUTH_SERVICE_GRPC.package,
      AUTH_SERVICE_GRPC.protoFile.map((e) => resolve(__dirname, e)),
    ),
  );

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
