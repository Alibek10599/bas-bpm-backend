import Redis from 'ioredis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_PROVIDER_TOKEN } from '@app/common/redis/redis.provider.token';

export const redisProvider: Provider = {
  provide: REDIS_PROVIDER_TOKEN,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      username: configService.get<string>('REDIS_USER'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
  },
};
