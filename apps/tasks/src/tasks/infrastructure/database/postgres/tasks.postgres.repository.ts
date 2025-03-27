import { TaskRepository } from '../../../domain/repository/task.repository';
import { Injectable } from '@nestjs/common';
import { CreateTask } from '../../../domain/repository/types/create-task';
import { FindAllTasksFilter } from '../../../domain/repository/types/find-all-tasks-filter';
import { PaginatedList, toPaginated } from '@app/common/pagination';
import { UpdateTask } from '../../../domain/repository/types/update-task';
import { Task } from './entities/task';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TasksPostgresRepository implements TaskRepository {
  constructor(
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  async createTask(createTask: CreateTask): Promise<Task> {
    return this.taskRepository.save(plainToInstance(Task, createTask));
  }

  async findAll(filter: FindAllTasksFilter): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findAllPaginated(
    filter: FindAllTasksFilter,
  ): Promise<PaginatedList<Task>> {
    return this.taskRepository
      .findAndCount()
      .then((res) => toPaginated(...res));
  }

  async findOneById(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }

  async updateTask(id: string, updateTask: UpdateTask): Promise<Task> {
    return this.taskRepository.save(
      plainToInstance(Task, { id, ...updateTask }),
    );
  }
}
