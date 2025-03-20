import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { RabbitmqTokenConst } from './rabbitmq-token.const';

export const rabbitmqClientCfg = (
  queue: string,
  urls: string[],
): ClientsProviderAsyncOptions => ({
  name: RabbitmqTokenConst,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      noAck: true,
      urls: urls,
      queue: queue + ':request',
      replyQueue: queue + ':response',
      queueOptions: {
        durable: true,
      },
    },
  }),
  inject: [ConfigService],
});
