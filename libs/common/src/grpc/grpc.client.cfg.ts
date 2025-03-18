import { GRPC_SERVICE_TOKEN } from './grpc-token.const';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transport, GrpcOptions } from '@nestjs/microservices';

export const grpcClientCfg = (grpcPackage: string, grpcProtoPath: string) => ({
  name: GRPC_SERVICE_TOKEN,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): GrpcOptions => ({
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow<string>('GRPC_URL'),
      package: grpcPackage,
      protoPath: grpcProtoPath,
    },
  }),
  inject: [ConfigService],
});
