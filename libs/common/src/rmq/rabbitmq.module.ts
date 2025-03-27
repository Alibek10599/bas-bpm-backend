import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';
import { rabbitmqClientCfg } from './rabbitmq.client.cfg';

@Module({})
export class RabbitmqModule {
  static forFeature(queue: string) {
    return {
      module: RabbitmqModule,
      imports: [ClientsModule.registerAsync([rabbitmqClientCfg(queue)])],
      providers: [RabbitmqService],
      exports: [RabbitmqService],
    };
  }
}
