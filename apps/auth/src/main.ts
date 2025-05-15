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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription(
      'Authentication and Authorization service for BAS BPM system',
    )
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
