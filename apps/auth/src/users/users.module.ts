import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/database';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { PrivilegesModule } from '../privileges/privileges.module';

@Module({
  imports: [DatabaseModule.forFeature([User]), RolesModule, PrivilegesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
