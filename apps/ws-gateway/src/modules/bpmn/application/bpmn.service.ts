import { Injectable } from '@nestjs/common';
import { UpdateBpmnDto } from '../interface/dto/update-bpmn.dto';
import { Server, Socket } from 'socket.io';
import { ON_UPDATE_KEY } from './const/on-update.key';

@Injectable()
export class BpmnService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  update(id: string, updateBpmnDto: UpdateBpmnDto, socket: Socket) {
    socket.to(id).except(socket.id).emit(ON_UPDATE_KEY, updateBpmnDto);
  }

  bpmnUpdateNotify(id: string) {
    if (!this.server) {
      console.error('Socket.IO сервер еще не инициализирован');
      return;
    }
    this.server.to(id).emit(ON_UPDATE_KEY, 'HELLOW WORLD');
  }

  subscribeOnUpdate(id: string, socket: Socket) {
    socket.join(id);
  }
}
