import { ClientsModule } from '@nestjs/microservices';
import { grpcClientCfg } from './grpc.client.cfg';

export class GrpcModule {
  static forFeature(
    url: string,
    grpcPackage: string | string[],
    grpcProtoPath: string | string[],
  ) {
    return ClientsModule.registerAsync([
      grpcClientCfg(url, grpcPackage, grpcProtoPath),
    ]);
  }
}
