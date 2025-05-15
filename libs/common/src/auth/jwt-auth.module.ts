import { Global, Module } from '@nestjs/common';
import { authGrpcProvider } from './auth-grpc.provider';
import { JwtAuthGuard } from './jwt-auth.guard';
import { resolve } from 'path';
import { GrpcModule } from '@app/common/grpc';
import { AUTH_SERVICE_GRPC } from '@app/common/constants';

@Global()
@Module({
  imports: [
    GrpcModule.forFeature(
      AUTH_SERVICE_GRPC.clientUrl,
      AUTH_SERVICE_GRPC.package,
      AUTH_SERVICE_GRPC.protoFile.map((e) => resolve(__dirname, e)),
    ),
  ],
  providers: [authGrpcProvider, JwtAuthGuard],
  exports: [authGrpcProvider, JwtAuthGuard],
})
export class JwtAuthModule {}
