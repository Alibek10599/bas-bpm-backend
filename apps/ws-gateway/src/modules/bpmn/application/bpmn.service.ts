import { Injectable } from '@nestjs/common';
import { UpdateBpmnDto } from '../interface/dto/update-bpmn.dto';
import { Socket } from 'socket.io';
import { ON_UPDATE_KEY } from './const/on-update.key';

@Injectable()
export class BpmnService {
  update(id: string, updateBpmnDto: UpdateBpmnDto, socket: Socket) {
    socket.to(id).except(socket.id).emit(ON_UPDATE_KEY, updateBpmnDto);
  }

  subscribeOnUpdate(id: string, socket: Socket) {
    socket.join(id);
  }
}
