import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { ReservationsModule } from './reservations.module';
import { grpcMsrvCfg } from '@app/common/grpc/grpc.msrv.cfg';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  app.connectMicroservice(
    grpcMsrvCfg(configService.getOrThrow<string>('GRPC_URL'), 'reservation', [
      join(__dirname, '/protos/reservations.proto'),
    ]),
  );
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
