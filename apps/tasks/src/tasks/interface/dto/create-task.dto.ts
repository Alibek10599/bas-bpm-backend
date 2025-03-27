import { TaskType } from '../../../infrastructure/enums/task-types.enum';

export class CreateTaskDto {
  workflowInstanceId: string;
  name: string;
  description?: string;
  status?: string;
  assignedTo: string;
  taskType: TaskType;
}
