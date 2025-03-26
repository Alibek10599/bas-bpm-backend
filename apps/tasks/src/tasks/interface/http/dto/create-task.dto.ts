import { TaskType } from '../../../infrastructure/enums/task-types.enum';

class CreateTaskMetadata {
  priority: string;
}

export class CreateTaskDto {
  workflowInstanceId: string;
  name: string;
  description?: string;
  status?: string;
  assignedTo: string;
  taskType: TaskType;
  metadata: CreateTaskMetadata;
}
