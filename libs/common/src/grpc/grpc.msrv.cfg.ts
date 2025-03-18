import { Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';

export const grpcMsrvCfg = (
  url: string,
  grpcPackage: string | string[],
  protoPath: string | string[],
) => ({
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
