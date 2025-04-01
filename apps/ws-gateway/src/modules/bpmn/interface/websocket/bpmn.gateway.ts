import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { BpmnService } from '../../application/bpmn.service';
import { UpdateBpmnDto } from '../dto/update-bpmn.dto';
import { OnUpdateSubscriptionDto } from '../dto/on-update-subscription.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class BpmnGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly bpmnService: BpmnService) {
    this.bpmnService.setServer(this.server);
  }

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
