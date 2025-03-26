import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '../domain/repository/task.repository';
import { FindAllTasksFilter } from '../domain/repository/types/find-all-tasks-filter';
import { TASK_REPOSITORY_TOKEN } from '../domain/repository/task.repository.token';
import { CreateTask } from '../domain/repository/types/create-task';
import { UpdateTask } from '../domain/repository/types/update-task';
import { TaskStatuses } from '../infrastructure/enums/task-statuses.enum';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: TaskRepository,
  ) {}

  async create(createTask: CreateTask) {
    const task = await this.taskRepository.createTask(createTask);
    return {
      taskId: task.id,
      message: 'Task created successfully',
    };
  }

  findAll(filter: FindAllTasksFilter) {
    return this.taskRepository.findAll(filter);
  }

  findAllPaginated(filter: FindAllTasksFilter) {
    return this.taskRepository.findAllPaginated(filter);
  }

  findOne(id: string) {
    return this.taskRepository.findOneById(id);
  }

  async findOneTaskStatus(id: string) {
    const task = await this.taskRepository.findOneById(id);
    return {
      taskId: task.id,
      status: task.status,
      message: 'Task status retrieved successfully',
    };
  }

  async update(id: string, updateTask: UpdateTask) {
    const task = await this.taskRepository.updateTask(id, updateTask);
    return {
      taskId: task.id,
      message: 'Task updated successfully',
    };
  }

  async assignTask(id: string, assignTo: string, userId: string) {
    const assignedTask = await this.taskRepository.assignTask(
      id,
      assignTo,
      userId,
    );

    return {
      taskId: assignedTask.id,
      status: assignedTask.assigned_to,
      message: 'Task assigned successfully',
    };
  }

  async completeTask(id: string, userId: string) {
    const completedTask = await this.taskRepository.completeTask(
      id,
      TaskStatuses.COMPLETED,
      userId,
    );

    return {
      taskId: completedTask.id,
      status: completedTask.status,
      message: 'Task completed successfully',
    };
  }
}
