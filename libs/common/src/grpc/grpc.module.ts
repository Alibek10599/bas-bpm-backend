import { ClientsModule } from '@nestjs/microservices';
import { grpcClientCfg } from './grpc.client.cfg';

export class GrpcModule {
  static forFeature(grpcPackage: string, grpcProtoPath: string) {
    return ClientsModule.registerAsync([
      grpcClientCfg(grpcPackage, grpcProtoPath),
    ]);
  }
}
