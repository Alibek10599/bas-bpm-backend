import { TasksService } from '../../application/tasks.service';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from '../http/dto/create-task.dto';
import { CompleteTaskDto } from '../dto/complete-task.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { GetTaskStatusDto } from '../dto/get-task-status.dto';
import { TaskTypeEnumInterceptor } from './interceptors/task-type-enum.interceptor';

@Controller()
export class GrpcTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseInterceptors(TaskTypeEnumInterceptor)
  @GrpcMethod('TasksService', 'CreateTask')
  async createTask(
    @Payload('metadata') metadata: any,
    @Payload() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      status: createTaskDto.status,
      type: createTaskDto.taskType,
      assigned_to: createTaskDto.assignedTo,
      metadata: createTaskDto.metadata,
      user_id: metadata.userId,
      tenant_id: metadata.tenantId,
      workflow_instance_id: createTaskDto.workflowInstanceId,
    });
  }

  @GrpcMethod('TasksService', 'CompleteTask')
  async completeTask(
    @Payload('metadata') metadata: any,
    @Payload() completeTaskDto: CompleteTaskDto,
  ) {
    return await this.tasksService.completeTask(
      completeTaskDto.taskId,
      metadata.userId,
    );
  }

  @GrpcMethod('TasksService', 'AssignTask')
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

  @GrpcMethod('TasksService', 'GetTaskStatus')
  async getTaskStatus(@Payload() getTaskStatusDto: GetTaskStatusDto) {
    return await this.tasksService.findOneTaskStatus(getTaskStatusDto.taskId);
  }
}
