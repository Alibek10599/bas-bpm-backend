import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthGrpc } from '@app/common/auth/interfaces/auth-grpc';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

/**
 * Для работы этого guard необходим JwtAuthModule, его добавляем в AppModule
 * */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_GRPC_PROVIDER') private readonly authGrpc: AuthGrpc,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwt = this.getJwtFromContext(context);

    if (!jwt) {
      return false;
    }

    const result = await firstValueFrom(
      this.authGrpc.Authenticate({
        token: jwt,
      }),
    ).catch((e) => {
      console.log('JwtAuthGuard', e);
      return null;
    });

    if (!result) {
      return false;
    }

    context.switchToHttp().getRequest().user = result;
    return true;
  }

  private getJwtFromContext(context: ExecutionContext) {
    const type = context.getType<'http' | 'https' | 'ws' | 'wss'>();

    if (type === 'http' || type === 'https') {
      const req = context.switchToHttp().getRequest();
      return this.extractHttpToken(req);
    } else if (type === 'ws' || type === 'wss') {
      const client = context.switchToWs().getClient();
      return this.extractWsToken(client.handshake);
    }
  }

  private extractTokenFromHeaders(req: Request): string {
    const authentication = req.headers['authorization'] as string;
    if (!authentication) {
      return null;
    }
    const [type, token] = authentication.split(' ');
    return type === 'Bearer' ? token : null;
  }

  private extractHttpToken(req: Request) {
    return req.cookies?.Authentication ?? this.extractTokenFromHeaders(req);
  }

  private extractWsToken(handshake: any): string {
    const fromHeader = this.extractTokenFromHeaders(handshake);
    if (fromHeader) return fromHeader;

    const authPayload = handshake.auth?.token;
    if (authPayload) return authPayload;

    const queryToken = handshake.query?.token;
    if (queryToken) return queryToken;

    return null;
  }
}
