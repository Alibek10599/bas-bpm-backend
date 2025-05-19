import { Injectable } from '@nestjs/common';
import { AccessesModel } from '@app/common';
import { RedisService } from '@app/common/redis';

@Injectable()
export class AccessRedisService {
  constructor(private readonly redisService: RedisService) {}

  getUserAccesses(userId: number): Promise<AccessesModel> {
    return this.redisService.get(`user:${userId}:accesses`);
  }

  setUserAccesses(userId: number, accesses: AccessesModel) {
    return this.redisService.set(`user:${userId}:accesses`, accesses);
  }

  setApiAccesses(apiTokenId: string, accesses: AccessesModel) {
    return this.redisService.set(
      `api-token:${apiTokenId}:accesses`,
      accesses,
      300,
    );
  }

  getApiAccesses(apiTokenId: string): Promise<AccessesModel> {
    return this.redisService.get(`api-token:${apiTokenId}:accesses`);
  }
}
