import { Module } from '@nestjs/common';
import { PrivilegesService } from './application/privileges.service';
import { PrivilegesController } from './interface/http/privileges.controller';
import { DatabaseModule } from '../database/database.module';
import { privilegesRepository } from './privileges.repository';
import { PrivilegesRmqController } from './interface/rmq/privileges.rmq.controller';
import { PrivilegesGrpcController } from './interface/grpc/privileges.grpc.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    PrivilegesController,
    PrivilegesRmqController,
    PrivilegesGrpcController,
  ],
  providers: [privilegesRepository, PrivilegesService],
})
export class PrivilegesModule {}
