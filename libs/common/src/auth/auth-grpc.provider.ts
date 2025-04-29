import { Provider } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICE_TOKEN } from '../grpc';
import { AuthGrpc } from './interfaces/auth-grpc';

export const authGrpcProvider: Provider[] = [
  {
    provide: 'AUTH_GRPC_PROVIDER',
    useFactory: (client: ClientGrpc) =>
      client.getService<AuthGrpc>('AuthService'),
    inject: [GRPC_SERVICE_TOKEN],
  },
];
