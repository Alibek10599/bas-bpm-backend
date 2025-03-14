import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [DatabaseModule.forFeature([User]), LoggerModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
