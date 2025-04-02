import { Module } from '@nestjs/common';
import { BpmnService } from './application/bpmn.service';
import { BpmnGateway } from './interface/websocket/bpmn.gateway';
import { RmqBpmnController } from './interface/rmq/rmq.bpmn.controller';
import { GrpcBpmnController } from './interface/grpc/grpc.bpmn.controller';

@Module({
  controllers: [RmqBpmnController, GrpcBpmnController],
  providers: [BpmnGateway, BpmnService],
})
export class BpmnModule {}
