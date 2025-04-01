import { Module } from '@nestjs/common';
import { BpmnService } from './bpmn.service';
import { BpmnGateway } from './bpmn.gateway';

@Module({
  providers: [BpmnGateway, BpmnService],
})
export class BpmnModule {}
