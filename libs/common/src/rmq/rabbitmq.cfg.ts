import { RmqOptions, Transport } from '@nestjs/microservices';

export const rabbitmqCfg = (urls: string[], queue: string): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    noAck: true,
    urls,
    queue: queue + ':request',
  },
});
