import { Task } from '../entities/task.entity';
import { CreateTask } from './types/create-task';
import { UpdateTask } from './types/update-task';
import { FindAllTasksFilter } from './types/find-all-tasks-filter';
import { PaginatedList } from '@app/common/pagination';
import { TaskStatuses } from '../../infrastructure/enums/task-statuses.enum';

export interface TaskRepository {
  findOneById(id: string): Promise<Task>;
  findAll(filter: FindAllTasksFilter): Promise<Task[]>;
  findAllPaginated(filter: FindAllTasksFilter): Promise<PaginatedList<Task>>;
  createTask(createTask: CreateTask): Promise<Task>;
  updateTask(id: string, updateTask: UpdateTask): Promise<Task>;
}
