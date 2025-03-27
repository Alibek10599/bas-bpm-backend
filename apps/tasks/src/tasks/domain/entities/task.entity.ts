import { TaskStatuses } from '../../infrastructure/enums/task-statuses.enum';
import { TaskType } from '../../infrastructure/enums/task-types.enum';

export class Task {
  id: string;

  workflowInstanceId?: string;

  name: string;

  description?: string;

  status: TaskStatuses;

  type: TaskType;

  assignedTo?: string;

  delegatedTo?: string;

  metadata: any;

  userId?: string;

  tenantId?: string;

  createdAt: string;

  updatedAt: string;
}
