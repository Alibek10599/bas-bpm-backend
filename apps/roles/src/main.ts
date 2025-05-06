import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { grpcCfg } from '@app/common/grpc';
import { GrpcOptions, RmqOptions } from '@nestjs/microservices';
import { rabbitmqCfg } from '@app/common/rmq';
import { ROLES_SERVICE_GRPC } from '@app/common/constants/grpc-cfg';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const rabbitMqUrls = configService
    .getOrThrow<string>('RABBITMQ_URLS')
    .split(',');
  const rabbitMqQueue = configService.getOrThrow<string>('RABBITMQ_QUEUE');

  app.connectMicroservice<RmqOptions>(rabbitmqCfg(rabbitMqUrls, rabbitMqQueue));

  const grpcUrl = configService.get<string>('GRPC_URL');
  app.connectMicroservice<GrpcOptions>(
    grpcCfg(
      grpcUrl,
      ROLES_SERVICE_GRPC.package,
      ROLES_SERVICE_GRPC.protoFile.map((e) => resolve(__dirname, e)),
    ),
  );

  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
