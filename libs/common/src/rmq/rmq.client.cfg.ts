import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { RmqTokenConst } from './rmq-token.const';

export const rmqClientCfg = (queue: string): ClientsProviderAsyncOptions => ({
  name: RmqTokenConst,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      noAck: true,
      urls: configService.getOrThrow<string>('RMQ_URLS').split(','),
      queue: queue + ':request',
      replyQueue: queue + ':response',
      queueOptions: {
        durable: true,
      },
    },
  }),
  inject: [ConfigService],
});
