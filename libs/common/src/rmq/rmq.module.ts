import { rmqClientCfg } from '@app/common/rmq/rmq.client.cfg';
import { ClientsModule } from '@nestjs/microservices';

export class RmqModule {
  static forFeature(queue: string) {
    return ClientsModule.registerAsync([rmqClientCfg(queue)]);
  }
}
