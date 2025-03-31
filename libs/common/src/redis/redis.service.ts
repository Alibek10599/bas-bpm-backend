import { Inject, Injectable } from '@nestjs/common';
import { REDIS_PROVIDER_TOKEN } from '@app/common/redis/redis.provider.token';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_PROVIDER_TOKEN)
    private readonly redisProvider: Redis,
  ) {}

  async getClient(): Promise<Redis> {
    return this.redisProvider;
  }

  async get<TValue extends object>(key: string): Promise<TValue> {
    const value = await this.redisProvider.get(key);
    return JSON.parse(value) as TValue;
  }

  /**
   * @param key - cache key
   * @param value - TValue extends object
   * @param expiration - time in seconds
   * */
  async set<TValue extends object>(
    key: string,
    value: TValue,
    expiration?: number,
  ): Promise<'OK'> {
    const stringValue = JSON.stringify(value);
    const result = await this.redisProvider.set(key, stringValue);
    if (expiration) this.redisProvider.expire(key, expiration);
    return result;
  }

  async incr(key: string, expiration?: number) {
    const result = await this.redisProvider.incr(key);
    if (expiration) this.redisProvider.expire(key, expiration);
    return result;
  }
}
