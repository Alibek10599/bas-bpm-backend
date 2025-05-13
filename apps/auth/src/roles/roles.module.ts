import { Module } from '@nestjs/common';
import { RolesService } from './application/roles.service';
import { RolesController } from './interface/http/roles.controller';
import { DatabaseModule } from '../../../roles/src/database/database.module';
import { rolesRepository } from './roles.repository';
import { RolesRmqController } from './interface/rmq/roles.rmq.controller';
import { RolesGrpcController } from './interface/grpc/roles.grpc.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController, RolesRmqController, RolesGrpcController],
  providers: [...rolesRepository, RolesService],
})
export class RolesModule {}
