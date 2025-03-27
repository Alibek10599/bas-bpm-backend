import { TasksService } from '../../application/tasks.service';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from '../dto/create-task.dto';
import { CompleteTaskDto } from '../dto/complete-task.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { GetTaskStatusDto } from '../dto/get-task-status.dto';
import { TaskTypeEnumInterceptor } from './interceptors/task-type-enum.interceptor';
import { RequestMetadata } from '../dto/request.metadata';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FindAllTasksFilter } from '../../domain/repository/types/find-all-tasks-filter';
import { GetOneTaskDto } from '../dto/get-one-task.dto';

@Controller()
export class GrpcTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseInterceptors(TaskTypeEnumInterceptor)
  @GrpcMethod('TasksService', 'CreateTask')
  async createTask(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      status: createTaskDto.status,
      type: createTaskDto.taskType,
      assignedTo: createTaskDto.assignedTo,
      userId: metadata.userId,
      tenantId: metadata.tenantId,
      workflowInstanceId: createTaskDto.workflowInstanceId,
    });
  }

  @GrpcMethod('TasksService', 'UpdateTask')
  update(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      updateTaskDto.taskId,
      {
        name: updateTaskDto.name,
        description: updateTaskDto.description,
        type: updateTaskDto.taskType,
        workflowInstanceId: updateTaskDto.workflowInstanceId,
      },
      metadata.userId,
    );
  }

  @GrpcMethod('TasksService', 'GetTaskPaginated')
  findAllPaginated(@Payload('body') findAllTasksFilter: FindAllTasksFilter) {
    return this.tasksService.findAllPaginated(findAllTasksFilter);
  }

  @GrpcMethod('TasksService', 'GetTaskList')
  async findAll(@Payload('body') findAllTasksFilter: FindAllTasksFilter) {
    return {
      items: await this.tasksService.findAll(findAllTasksFilter),
    };
  }

  @GrpcMethod('TasksService', 'GetTaskById')
  findOne(@Payload('body') getOneTaskDto: GetOneTaskDto) {
    return this.tasksService.findOne(getOneTaskDto.taskId);
  }

  @GrpcMethod('TasksService', 'CompleteTask')
  async completeTask(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') completeTaskDto: CompleteTaskDto,
  ) {
    return await this.tasksService.completeTask(
      completeTaskDto.taskId,
      metadata.userId,
    );
  }

  @GrpcMethod('TasksService', 'AssignTask')
  async assignTask(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') assignTaskDto: AssignTaskDto,
  ) {
    return await this.tasksService.assignTask(
      assignTaskDto.taskId,
      assignTaskDto.assignedTo,
      metadata.userId,
    );
  }

  @GrpcMethod('TasksService', 'GetTaskStatus')
  async getTaskStatus(@Payload('body') getTaskStatusDto: GetTaskStatusDto) {
    return await this.tasksService.findOneTaskStatus(getTaskStatusDto.taskId);
  }
}
