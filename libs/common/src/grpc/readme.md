### Module
```typescript

@Module({
  imports: [GrpcModule.forFeature('users', 'protopath')],
  controllers: [UsersController],
  providers: [...usersGrpcProvider, UsersService],
})
export class UsersModule {}
```

### provider
```typescript
import { Provider } from '@nestjs/common';
import { GRPC_SERVICE_TOKEN } from '@app/common/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { UsersGrpc } from './interfaces/UsersGrpc';

export const usersGrpcProvider: Provider[] = [
  {
    provide: 'USERS_GRPC_PROVIDER',
    useFactory: (client: ClientGrpc) =>
      client.getService<UsersGrpc>('UsersService'),
    inject: [GRPC_SERVICE_TOKEN],
  },
];
```

### GrpcInterface
```typescript
import { CreateUserDto } from '../dto/create-user.dto';
import { Observable } from 'rxjs';

export interface UsersGrpc {
  createUser(data: CreateUserDto): Observable<{ id: string }>;
}
```