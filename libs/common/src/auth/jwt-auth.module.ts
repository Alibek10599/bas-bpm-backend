import { Module } from '@nestjs/common';
import { authGrpcProvider } from './auth-grpc.provider';
import { JwtAuthGuard } from './jwt-auth.guard';
import { join } from 'path';
import { GrpcModule } from '@app/common/grpc';

@Module({
  imports: [
    GrpcModule.forFeature(
      'localhost:50051',
      'auth',
      join(__dirname, './auth.proto'),
    ),
  ],
  providers: [authGrpcProvider, JwtAuthGuard],
  exports: [authGrpcProvider, JwtAuthGuard],
})
export class JwtAuthModule {}
