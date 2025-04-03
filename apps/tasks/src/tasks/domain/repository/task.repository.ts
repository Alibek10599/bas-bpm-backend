import { CreateTask } from './types/create-task';
import { UpdateTask } from './types/update-task';
import { FindAllTasksFilter } from './types/find-all-tasks-filter';
import { PaginatedList } from '@app/common/pagination';
import { Task } from '../../infrastructure/database/postgres/entities/task';

export interface TaskRepository {
  findOneById(id: string): Promise<Task>;
  findAll(filter: FindAllTasksFilter): Promise<Task[]>;
  findAllPaginated(filter: FindAllTasksFilter): Promise<PaginatedList<Task>>;
  createTask(createTask: CreateTask): Promise<Task>;
  updateTask(id: string, updateTask: UpdateTask): Promise<Task>;
}
