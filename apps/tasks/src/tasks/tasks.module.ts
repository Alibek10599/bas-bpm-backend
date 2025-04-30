import { Module } from '@nestjs/common';
import { TasksService } from './application/tasks.service';
import { TasksController } from './interface/http/tasks.controller';
import { tasksRepository } from './tasks.repository';
import { RmqTasksController } from './interface/rmq/rmq.tasks.controller';
import { DatabaseModule } from '../database/database.module';
import { GrpcTasksController } from './interface/grpc/grpc.tasks.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController, RmqTasksController, GrpcTasksController],
  providers: [tasksRepository, TasksService],
})
export class TasksModule {}
