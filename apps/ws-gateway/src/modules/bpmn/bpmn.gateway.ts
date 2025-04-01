import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { BpmnService } from './bpmn.service';
import { UpdateBpmnDto } from './dto/update-bpmn.dto';
import { OnUpdateSubscriptionDto } from './dto/on-update-subscription.dto';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class BpmnGateway {
  constructor(private readonly bpmnService: BpmnService) {}

  @SubscribeMessage('update')
  update(
    @ConnectedSocket() socket: Socket,
    @MessageBody() updateBpmnDto: UpdateBpmnDto,
  ) {
    return this.bpmnService.update(updateBpmnDto.id, updateBpmnDto, socket);
  }

  @SubscribeMessage('sub-on-update')
  subscribeOnUpdate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() onUpdateSubscriptionDto: OnUpdateSubscriptionDto,
  ) {
    return this.bpmnService.subscribeOnUpdate(
      onUpdateSubscriptionDto.id,
      socket,
    );
  }
}
