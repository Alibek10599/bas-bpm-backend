import { TaskRepository } from '../../../domain/repository/task.repository';
import { Injectable } from '@nestjs/common';
import { CreateTask } from '../../../domain/repository/types/create-task';
import { FindAllTasksFilter } from '../../../domain/repository/types/find-all-tasks-filter';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { UpdateTask } from '../../../domain/repository/types/update-task';
import { TaskEntity } from './entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TaskStatuses } from '../../enums/task-statuses.enum';
import { TaskVersion } from '../../../../tasks-versions/infrastructure/database/postgres/entities/task-version.entity';

@Injectable()
export class TasksPostgresRepository implements TaskRepository {
  constructor(
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createTask(createTask: CreateTask): Promise<TaskEntity> {
    return this.taskRepository.save(plainToInstance(TaskEntity, createTask));
  }

  async findAll(filter: FindAllTasksFilter): Promise<TaskEntity[]> {
    return this.taskRepository.find();
  }

  async findAllPaginated(
    filter: FindAllTasksFilter,
  ): Promise<PaginatedList<TaskEntity>> {
    return this.taskRepository
      .findAndCount()
      .then((res) => toPaginated(...res));
  }

  async findOneById(id: string): Promise<TaskEntity> {
    return this.taskRepository.findOneBy({ id });
  }

  async updateTask(id: string, updateTask: UpdateTask): Promise<TaskEntity> {
    return this.taskRepository.save(
      plainToInstance(TaskEntity, { id, ...updateTask }),
    );
  }

  async assignTask(
    id: string,
    assignTo: string,
    userId: string,
  ): Promise<{ id: string; assigned_to: string }> {
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const currentTask = await em.getRepository(TaskEntity).findOneBy({ id });
      const currentTaskVersion = await em
        .getRepository(TaskVersion)
        .findOne({ where: { task: currentTask }, order: { id: 'desc' } });

      const task = await em
        .getRepository(TaskEntity)
        .save(plainToInstance(TaskEntity, { id, assigned_to: assignTo }));

      await em.getRepository(TaskVersion).save({
        task,
        changed_data: {
          assigned_to: {
            old: currentTask.assigned_to,
            new: assignTo,
          },
        },
        version: (currentTaskVersion?.version ?? 0) + 1,
        user_id: userId,
      });

      return {
        id: task.id,
        assigned_to: task.assigned_to,
      };
    });
  }

  async completeTask(
    id: string,
    taskStatus: TaskStatuses,
    userId: string,
  ): Promise<{ id: string; status: TaskStatuses }> {
    return await this.dataSource.transaction('REPEATABLE READ', async (em) => {
      const currentTask = await em.getRepository(TaskEntity).findOneBy({ id });
      const currentTaskVersion = await em
        .getRepository(TaskVersion)
        .findOne({ where: { task: currentTask }, order: { id: 'desc' } });

      const task = await em
        .getRepository(TaskEntity)
        .save(plainToInstance(TaskEntity, { id, status: taskStatus }));

      await em.getRepository(TaskVersion).save({
        task,
        changed_data: {
          status: {
            old: currentTask.status,
            new: taskStatus,
          },
        },
        version: (currentTaskVersion?.version ?? 0) + 1,
        user_id: userId,
      });

      return {
        id: task.id,
        status: task.status,
      };
    });
  }
}
