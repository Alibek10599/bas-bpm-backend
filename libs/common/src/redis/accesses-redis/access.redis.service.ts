import { Injectable } from '@nestjs/common';
import { AccessesModel } from '@app/common';
import { RedisService } from '@app/common/redis';

@Injectable()
export class AccessRedisService {
  constructor(private readonly redisService: RedisService) {}

  get(userId: string): Promise<AccessesModel> {
    return this.redisService.get(`user:${userId}:accesses`);
  }

  set(userId: string, accesses: AccessesModel) {
    return this.redisService.set(`user:${userId}:accesses`, accesses);
  }
}
