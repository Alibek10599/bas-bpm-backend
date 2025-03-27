import { Inject, Injectable } from '@nestjs/common';
import { TaskRepository } from '../domain/repository/task.repository';
import { FindAllTasksFilter } from '../domain/repository/types/find-all-tasks-filter';
import { TASK_REPOSITORY_TOKEN } from '../domain/repository/task.repository.token';
import { CreateTask } from '../domain/repository/types/create-task';
import { UpdateTask } from '../domain/repository/types/update-task';
import { TaskStatuses } from '../infrastructure/enums/task-statuses.enum';
import { TaskEntity } from '../infrastructure/database/postgres/entities/task.entity';
import { TaskVersion } from '../../tasks-versions/infrastructure/database/postgres/entities/task-version.entity';
import { DataSource } from 'typeorm';
import { DATABASE_PROVIDER_TOKEN } from '../../database/database-provider-token.const';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: TaskRepository,
    @Inject(DATABASE_PROVIDER_TOKEN)
    private readonly dataSource: DataSource,
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
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const taskRepo = em.getRepository(TaskEntity);
      const versionRepo = em.getRepository(TaskVersion);

      const currentTask = await taskRepo.findOneBy({ id });
      if (!currentTask) {
        throw new Error(`Task with id ${id} not found`);
      }

      const currentTaskVersion = await versionRepo.findOne({
        where: { task: currentTask },
        order: { id: 'desc' },
      });

      currentTask.assignedTo = assignTo;
      const updatedTask = await taskRepo.save(currentTask);

      await versionRepo.save({
        task: updatedTask,
        changed_data: {
          assigned_to: { old: currentTask.assignedTo, new: assignTo },
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

  async completeTask(id: string, userId: string) {
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const currentTask = await em
        .getRepository(TaskEntity)
        .findOneByOrFail({ id });
      const currentTaskVersion = await em
        .getRepository(TaskVersion)
        .findOne({ where: { task: currentTask }, order: { id: 'desc' } });

      const oldStatus = currentTask.status;

      currentTask.status = TaskStatuses.COMPLETED;

      const task = await em.getRepository(TaskEntity).save(currentTask);

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
