import { Module } from '@nestjs/common';
import { authGrpcProvider } from './auth-grpc.provider';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [...authGrpcProvider, JwtAuthGuard],
  exports: [...authGrpcProvider, JwtAuthGuard],
})
export class JwtAuthModule {}
