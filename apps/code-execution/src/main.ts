import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { GrpcOptions, RmqOptions } from '@nestjs/microservices';
import { rabbitmqCfg } from '@app/common/rmq';
import { grpcCfg } from '@app/common/grpc';
import { join } from 'path';
import { AppModule } from './app.module';

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
      ['scripts', 'code_execution'],
      [
        join(__dirname, './scripts.proto'),
        join(__dirname, './code-execution.proto'),
      ],
    ),
  );

  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
