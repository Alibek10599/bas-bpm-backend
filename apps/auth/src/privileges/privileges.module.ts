import { Module } from '@nestjs/common';
import { PrivilegesService } from './application/privileges.service';
import { PrivilegesController } from './interface/http/privileges.controller';
import { PrivilegesRmqController } from './interface/rmq/privileges.rmq.controller';
import { PrivilegesGrpcController } from './interface/grpc/privileges.grpc.controller';
import { Privilege } from './infrastructure/database/postgres/entities/privilege.entity';
import { PrivilegeVersion } from './infrastructure/database/postgres/entities/privilege-version.entity';
import { PrivilegesPostgresRepository } from './infrastructure/database/postgres/privileges.postgres.repository';
import { PRIVILEGES_REPOSITORY_TOKEN } from './domain/repository/privileges.repository.token';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Privilege, PrivilegeVersion])],
  controllers: [
    PrivilegesController,
    PrivilegesRmqController,
    PrivilegesGrpcController,
  ],
  providers: [
    {
      provide: PRIVILEGES_REPOSITORY_TOKEN,
      useClass: PrivilegesPostgresRepository,
    },
    PrivilegesService,
  ],
  exports: [PrivilegesService],
})
export class PrivilegesModule {}
