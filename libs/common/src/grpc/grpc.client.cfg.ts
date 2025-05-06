import { GRPC_SERVICE_TOKEN } from './grpc-token.const';
import { Transport, GrpcOptions } from '@nestjs/microservices';

export const grpcClientCfg = (
  url: string,
  grpcPackages: string | string[],
  grpcProtoPath: string | string[],
) => {
  return {
    name: GRPC_SERVICE_TOKEN,
    useFactory: (): GrpcOptions => ({
      transport: Transport.GRPC,
      options: {
        url: url,
        package: grpcPackages,
        protoPath: grpcProtoPath,
      },
    }),
  };
};
