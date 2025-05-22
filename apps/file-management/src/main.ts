import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GrpcOptions, RmqOptions } from '@nestjs/microservices';
import { rabbitmqCfg } from '@app/common/rmq';
import { grpcCfg } from '@app/common/grpc';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

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
    grpcCfg(grpcUrl, ['documents'], [join(__dirname, './documents.proto')]),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('File Management Service API')
    .setDescription('Document and file management service for BAS BPM system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
