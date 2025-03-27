import { TasksService } from '../../application/tasks.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from '../http/dto/create-task.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { CompleteTaskDto } from '../dto/complete-task.dto';
import { GetTaskStatusDto } from '../dto/get-task-status.dto';

@Controller()
export class RmqTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('task.create')
  async createTask(
    @Payload('metadata') metadata: any,
    @Payload() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      status: createTaskDto.status,
      type: createTaskDto.taskType,
      assignedTo: createTaskDto.assignedTo,
      metadata: createTaskDto.metadata,
      userId: metadata.userId,
      tenantId: metadata.tenantId,
      workflowInstanceId: createTaskDto.workflowInstanceId,
    });
  }

  @MessagePattern('task.complete')
  async completeTask(
    @Payload('metadata') metadata: any,
    @Payload() completeTaskDto: CompleteTaskDto,
  ) {
    return await this.tasksService.completeTask(
      completeTaskDto.taskId,
      metadata.userId,
    );
  }

  @MessagePattern('task.assign')
  async assignTask(
    @Payload('metadata') metadata: any,
    @Payload() assignTaskDto: AssignTaskDto,
  ) {
    return await this.tasksService.assignTask(
      assignTaskDto.taskId,
      assignTaskDto.assignedTo,
      metadata.userId,
    );
  }

  @MessagePattern('task.status')
  async getTaskStatus(@Payload() getTaskStatusDto: GetTaskStatusDto) {
    return await this.tasksService.findOneTaskStatus(getTaskStatusDto.taskId);
  }
}
