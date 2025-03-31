import { Module } from '@nestjs/common';
import { RedisService } from '@app/common/redis/redis.service';
import { redisProvider } from '@app/common/redis/redis.provider';

@Module({
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
