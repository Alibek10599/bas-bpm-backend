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
import { AccessesModelPaths } from '@app/common/types/access-model-path';
import { AccessesModel } from '@app/common/types/accesses-model';
import { TokenPayloadUserTypes } from '@app/common/types';

/**
 * Для работы этого декоратора необходим AccessRedisModule, его добавляем в AppModule
 * */
export function AccessGuard(requiredAccesses: AccessesModelPaths[]) {
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
      const type = request.user?.type;
      const userId = request.user?.userId;
      const tokenId = request.user?.tokenId;
      const ignoreAccessCheck = this.configService.get('BYPASS_PERMISSIONS');

      if (ignoreAccessCheck) {
        this.logger.warn(
          'Access control checks are disabled via BYPASS_PERMISSIONS=true. This may expose sensitive data or allow unauthorized actions.',
        );
        return true;
      }

      let accessList: AccessesModel;

      if (type === TokenPayloadUserTypes.User && userId) {
        accessList = await this.accessRedisService.getUserAccesses(userId);
      }
      if (type === TokenPayloadUserTypes.Api && tokenId) {
        accessList = await this.accessRedisService.getApiAccesses(tokenId);
      }

      if (!accessList) {
        return false;
      }

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
