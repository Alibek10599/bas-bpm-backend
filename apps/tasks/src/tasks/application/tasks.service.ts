import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../domain/repository/task.repository';
import { FindAllTasksFilter } from '../domain/repository/types/find-all-tasks-filter';
import { TASK_REPOSITORY_TOKEN } from '../domain/repository/task.repository.token';
import { CreateTask } from '../domain/repository/types/create-task';
import { UpdateTask } from '../domain/repository/types/update-task';
import { TaskStatuses } from '../infrastructure/enums/task-statuses.enum';
import { Task } from '../infrastructure/database/postgres/entities/task';
import { TaskVersion } from '../../tasks-versions/infrastructure/database/postgres/entities/task-version.entity';
import { DataSource } from 'typeorm';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';
import { CreateTaskResponseDto } from '../interface/dto/create-task-response.dto';
import { PaginatedList } from '@app/common/pagination';
import { TaskStatusResponseDto } from '../interface/dto/task-status-response.dto';
import { UpdateTaskResponseDto } from '../interface/dto/update-task-response.dto';
import { AssignTaskResponseDto } from '../interface/dto/assign-task-response.dto';
import { CompleteTaskResponseDto } from '../interface/dto/complete-task-response.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: TaskRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
  ) {}

  async create(createTask: CreateTask): Promise<CreateTaskResponseDto> {
    const task = await this.taskRepository.createTask(createTask);
    return {
      taskId: task.id,
      message: 'Task created successfully',
    };
  }

  findAll(filter: FindAllTasksFilter): Promise<Task[]> {
    return this.taskRepository.findAll(filter);
  }

  findAllPaginated(filter: FindAllTasksFilter): Promise<PaginatedList<Task>> {
    return this.taskRepository.findAllPaginated(filter);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneById(id);
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }
    return task;
  }

  async findOneTaskStatus(id: string): Promise<TaskStatusResponseDto> {
    const task = await this.taskRepository.findOneById(id);
    return {
      taskId: task.id,
      status: task.status,
      message: 'Task status retrieved successfully',
    };
  }

  async update(
    id: string,
    updateTask: UpdateTask,
    userId: string,
  ): Promise<UpdateTaskResponseDto> {
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const taskRepo = em.getRepository(Task);
      const versionRepo = em.getRepository(TaskVersion);

      const task = await taskRepo.findOneBy({ id });

      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }

      const currentTaskVersion = await versionRepo.findOne({
        where: { task: { id } },
        order: { id: 'desc' },
      });

      const updatedTask = await this.taskRepository.updateTask(id, updateTask);

      await versionRepo.save({
        task: updatedTask,
        changed_data: this.getTaskChanges(task, updateTask),
        version: (currentTaskVersion?.version ?? 0) + 1,
        user_id: userId,
      });

      return {
        taskId: task.id,
        message: 'Task updated successfully',
      };
    });
  }

  private getTaskChanges(task: Task, updateTask: UpdateTask) {
    const changes = {};
    for (const key in updateTask) {
      if (task[key] && updateTask[key] && updateTask[key] !== task[key]) {
        changes[key] = {
          old: task[key],
          new: updateTask[key],
        };
      }
    }
    return changes;
  }

  async assignTask(
    id: string,
    assignTo: string,
    userId: string,
  ): Promise<AssignTaskResponseDto> {
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const taskRepo = em.getRepository(Task);
      const versionRepo = em.getRepository(TaskVersion);

      const currentTask = await taskRepo.findOneBy({ id });
      if (!currentTask) {
        throw new Error(`Task with id ${id} not found`);
      }

      const oldAssignedTo = currentTask.assignedTo;

      const currentTaskVersion = await versionRepo.findOne({
        where: { task: { id } },
        order: { id: 'desc' },
      });

      currentTask.assignedTo = assignTo;
      const updatedTask = await taskRepo.save(currentTask);

      await versionRepo.save({
        task: updatedTask,
        changed_data: {
          assignedTo: { old: oldAssignedTo, new: assignTo },
        },
        version: (currentTaskVersion?.version ?? 0) + 1,
        user_id: userId,
      });

      return {
        taskId: updatedTask.id,
        assignedTo: updatedTask.assignedTo,
        message: 'Task assigned successfully',
      };
    });
  }

  async completeTask(
    id: string,
    userId: string,
  ): Promise<CompleteTaskResponseDto> {
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const currentTask = await em.getRepository(Task).findOneByOrFail({ id });
      const currentTaskVersion = await em
        .getRepository(TaskVersion)
        .findOne({ where: { task: { id } }, order: { id: 'desc' } });

      const oldStatus = currentTask.status;

      currentTask.status = TaskStatuses.COMPLETED;

      const task = await em.getRepository(Task).save(currentTask);

      await em.getRepository(TaskVersion).save({
        task,
        changed_data: {
          status: {
            old: oldStatus,
            new: currentTask.status,
          },
        },
        version: (currentTaskVersion?.version ?? 0) + 1,
        user_id: userId,
      });

      return {
        taskId: currentTask.id,
        status: currentTask.status,
        message: 'Task completed successfully',
      };
    });
  }
}
