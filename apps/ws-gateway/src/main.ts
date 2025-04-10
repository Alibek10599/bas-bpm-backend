import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './core/adapters/redis.io.adapter';
import { GrpcOptions, RmqOptions } from '@nestjs/microservices';
import { rabbitmqCfg } from '@app/common/rmq';
import { grpcCfg } from '@app/common/grpc';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(configService.get('REDIS_URL'));
  app.useWebSocketAdapter(redisIoAdapter);

  const rabbitMqUrls = configService
    .getOrThrow<string>('RABBITMQ_URLS')
    .split(',');
  const rabbitMqQueue = configService.getOrThrow<string>('RABBITMQ_QUEUE');

  app.connectMicroservice<RmqOptions>(rabbitmqCfg(rabbitMqUrls, rabbitMqQueue));

  const grpcUrl = configService.get<string>('GRPC_URL');
  app.connectMicroservice<GrpcOptions>(
    grpcCfg(grpcUrl, ['ws_bpmn'], [join(__dirname, './ws-bpmn.proto')]),
  );

  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
