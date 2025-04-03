import { TasksService } from '../../application/tasks.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from '../dto/create-task.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { CompleteTaskDto } from '../dto/complete-task.dto';
import { GetTaskStatusDto } from '../dto/get-task-status.dto';
import { RequestMetadata } from '../dto/request.metadata';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FindAllTasksFilter } from '../../domain/repository/types/find-all-tasks-filter';
import { GetOneTaskDto } from '../dto/get-one-task.dto';

@Controller()
export class RmqTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('task.create')
  async createTask(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create({
      ...createTaskDto,
      userId: metadata.userId,
      tenantId: metadata.tenantId,
    });
  }

  @MessagePattern('task.update')
  update(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      updateTaskDto.taskId,
      updateTaskDto,
      metadata.userId,
    );
  }

  @MessagePattern('task.get.paginated')
  findAllPaginated(@Payload('body') findAllTasksFilter: FindAllTasksFilter) {
    return this.tasksService.findAllPaginated(findAllTasksFilter);
  }

  @MessagePattern('task.get.list')
  findAll(@Payload('body') findAllTasksFilter: FindAllTasksFilter) {
    return this.tasksService.findAll(findAllTasksFilter);
  }

  @MessagePattern('task.get.one')
  findOne(@Payload('body') getOneTaskDto: GetOneTaskDto) {
    return this.tasksService.findOne(getOneTaskDto.taskId);
  }

  @MessagePattern('task.complete')
  async completeTask(
    @Payload('metadata') metadata: RequestMetadata,
    @Payload('body') completeTaskDto: CompleteTaskDto,
  ) {
    return await this.tasksService.completeTask(
      completeTaskDto.taskId,
      metadata.userId,
    );
  }

  @MessagePattern('task.assign')
  async assignTask(
    @Payload('metadata') metadata: any,
    @Payload('body') assignTaskDto: AssignTaskDto,
  ) {
    return await this.tasksService.assignTask(
      assignTaskDto.taskId,
      assignTaskDto.assignedTo,
      metadata.userId,
    );
  }

  @MessagePattern('task.status')
  async getTaskStatus(@Payload('body') getTaskStatusDto: GetTaskStatusDto) {
    return await this.tasksService.findOneTaskStatus(getTaskStatusDto.taskId);
  }
}
