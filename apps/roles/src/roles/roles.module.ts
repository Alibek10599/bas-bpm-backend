import { Module } from '@nestjs/common';
import { RolesService } from './application/roles.service';
import { RolesController } from './interface/http/roles.controller';
import { DatabaseModule } from '../database/database.module';
import { rolesRepository } from './roles.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [...rolesRepository, RolesService],
})
export class RolesModule {}
