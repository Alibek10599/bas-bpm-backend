import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BpmnService } from '../../application/bpmn.service';
import { UpdateBpmnNotificationDto } from '../dto/update-bpmn.notification.dto';

@Controller()
export class RmqBpmnController {
  constructor(private readonly bpmnService: BpmnService) {}

  @MessagePattern('bpmn.update.notify')
  async bpmnUpdateNotify(@Payload('body') data: UpdateBpmnNotificationDto) {
    this.bpmnService.bpmnUpdateNotify(data.id);
  }
}
