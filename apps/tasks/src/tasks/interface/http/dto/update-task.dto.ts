import { TaskType } from '../../../infrastructure/enums/task-types.enum';

class UpdateTaskMetadata {
  priority: string;
}

export class UpdateTaskDto {
  workflowInstanceId?: string;
  name?: string;
  description?: string;
  taskType?: TaskType;
  metadata?: UpdateTaskMetadata;
}
