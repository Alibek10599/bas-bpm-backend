import { Module } from '@nestjs/common';
import { TasksService } from './application/tasks.service';
import { TasksController } from './interface/http/tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
