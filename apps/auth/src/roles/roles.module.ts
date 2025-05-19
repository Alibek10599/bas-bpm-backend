import { Module } from '@nestjs/common';
import { RolesService } from './application/roles.service';
import { RolesController } from './interface/http/roles.controller';
import { RolesRmqController } from './interface/rmq/roles.rmq.controller';
import { RolesGrpcController } from './interface/grpc/roles.grpc.controller';
import { DatabaseModule } from '@app/common';
import { Role } from './infrastructure/database/postgres/entities/role.entity';
import { RoleVersion } from './infrastructure/database/postgres/entities/role-version.entity';
import { ROLE_REPOSITORY_TOKEN } from './domain/repository/roles.repository.token';
import { RolesPostgresRepository } from './infrastructure/database/postgres/roles.postgres.repository';

@Module({
  imports: [DatabaseModule.forFeature([Role, RoleVersion])],
  controllers: [RolesController, RolesRmqController, RolesGrpcController],
  providers: [
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: RolesPostgresRepository,
    },
    RolesService,
  ],
  exports: [RolesService],
})
export class RolesModule {}
