import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateBpmnNotificationDto } from '../dto/update-bpmn.notification.dto';
import { BpmnGateway } from '../websocket/bpmn.gateway';

@Controller()
export class RmqBpmnController {
  constructor(private readonly bpmnGateway: BpmnGateway) {}

  @MessagePattern('bpmn.update.notify')
  async bpmnUpdateNotify(@Payload('body') data: UpdateBpmnNotificationDto) {
    this.bpmnGateway.bpmnUpdateNotify(data.id);
  }
}
