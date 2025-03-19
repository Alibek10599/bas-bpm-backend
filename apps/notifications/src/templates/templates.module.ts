import { Module } from '@nestjs/common';
import { TemplatesService } from './application/templates.service';
import { GrpcTemplatesController } from './interface/grpc/grpc.templates.controller';
import { HttpTemplatesController } from './interface/http/http.templates.controller';
import { RmqTemplatesController } from './interface/rmq/rmq.templates.controller';

@Module({
  controllers: [
    HttpTemplatesController,
    GrpcTemplatesController,
    RmqTemplatesController,
  ],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
