import { rabbitmqClientCfg } from '@app/common/rmq/rabbitmq.client.cfg';
import { ClientsModule } from '@nestjs/microservices';

export class RabbitmqModule {
  static forFeature(queue: string, urls: string[]) {
    return ClientsModule.registerAsync([rabbitmqClientCfg(queue, urls)]);
  }
}
