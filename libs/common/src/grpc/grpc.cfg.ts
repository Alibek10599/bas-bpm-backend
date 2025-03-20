import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';

export const grpcCfg = (
  url: string,
  grpcPackage: string | string[],
  protoPath: string | string[],
): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    package: grpcPackage,
    protoPath: protoPath,
    url: url,
    loader: {
      keepCase: true,
    },
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg).addToServer(server);
    },
  },
});
