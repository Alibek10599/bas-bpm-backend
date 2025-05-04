import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { AuthenticateBodyDto } from './dto/authenticate-body.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Authenticate')
  async authenticate(@Payload('body') body: AuthenticateBodyDto) {
    console.log('trying to auth', body);
    return {
      tenantId: 'vit',
      userId: 'uid-1',
    };
  }
}
