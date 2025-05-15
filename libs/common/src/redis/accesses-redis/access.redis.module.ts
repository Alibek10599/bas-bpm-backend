import { Global, Module } from '@nestjs/common';
import { AccessRedisService } from './access.redis.service';
import { RedisModule } from '@app/common/redis';

@Global()
@Module({
  imports: [RedisModule],
  providers: [AccessRedisService],
  exports: [AccessRedisService],
})
export class AccessRedisModule {}
