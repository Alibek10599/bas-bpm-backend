import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { UpdateBpmnNotificationDto } from '../dto/update-bpmn.notification.dto';
import { BpmnGateway } from '../websocket/bpmn.gateway';

@Controller()
export class GrpcBpmnController {
  constructor(private readonly bpmnGateway: BpmnGateway) {}

  @GrpcMethod('WsBpmn', 'BpmnUpdateNotify')
  async bpmnUpdateNotify(@Payload('body') data: UpdateBpmnNotificationDto) {
    this.bpmnGateway.bpmnUpdateNotify(data.id);
  }
}
