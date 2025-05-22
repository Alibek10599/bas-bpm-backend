import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { AuthenticateBodyDto } from './dto/authenticate-body.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication gRPC')
@Controller()
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Verify JWT token via gRPC' })
  @ApiResponse({
    status: 200,
    description: 'Token verified successfully',
    schema: {
      properties: {
        userId: { type: 'string' },
        tenantId: { type: 'string' },
        roles: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @GrpcMethod('AuthService', 'Authenticate')
  async authenticate(@Payload() body: AuthenticateBodyDto) {
    return this.authService.verifyToken(body.token);
  }
}
