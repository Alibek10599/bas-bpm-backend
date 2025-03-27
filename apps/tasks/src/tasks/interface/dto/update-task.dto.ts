import { TaskType } from '../../infrastructure/enums/task-types.enum';

export class UpdateTaskDto {
  taskId?: string;
  workflowInstanceId?: string;
  name?: string;
  description?: string;
  taskType?: TaskType;
}
