import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitmqTokenConst } from './rabbitmq-token.const';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject(RabbitmqTokenConst) private readonly client: ClientProxy,
  ) {}

  async send(pattern: any, data: any) {
    return this.client.send(pattern, data);
  }

  async emit(pattern: any, data: any) {
    return this.client.emit(pattern, data);
  }
}
