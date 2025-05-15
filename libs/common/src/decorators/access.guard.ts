import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessRedisService } from '@app/common/redis/accesses-redis';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

export function AccessGuard(requiredAccesses: string[]) {
  @Injectable()
  class AccessGuardMixin implements CanActivate {
    constructor(
      readonly reflector: Reflector,
      readonly accessRedisService: AccessRedisService,
      readonly configService: ConfigService,
      readonly logger: Logger,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.userId;
      const ignoreAccessCheck =
        this.configService.get<string>('BYPASS_PERMISSIONS');

      if (ignoreAccessCheck === 'true') {
        this.logger.warn(
          'Access control checks are disabled via BYPASS_PERMISSIONS=true. This may expose sensitive data or allow unauthorized actions.',
        );
        return true;
      }

      if (!userId) return false;

      const accessList = await this.accessRedisService.get(userId);

      return requiredAccesses.every((accessPath) =>
        this.hasAccessRecursive(accessList, accessPath.split('.')),
      );
    }

    hasAccessRecursive(accessList: any, accessPath: string[]): boolean {
      const [key, ...rest] = accessPath;

      if (!(key in accessList)) return false;

      const value = accessList[key];

      if (rest.length === 0) {
        return value === true;
      }

      if (typeof value !== 'object' || value === null) {
        return false;
      }

      return this.hasAccessRecursive(value, rest);
    }
  }

  return mixin(AccessGuardMixin);
}
