import { TaskStatuses } from '../../infrastructure/enums/task-statuses.enum';
import { TaskType } from '../../infrastructure/enums/task-types.enum';

export class Task {
  id: string;

  workflow_instance_id?: string;

  name: string;

  description?: string;

  status: TaskStatuses;

  type: TaskType;

  assigned_to?: string;

  delegated_to?: string;

  metadata: any;

  user_id?: string;

  tenant_id?: string;

  created_at: string;

  updated_at: string;
}
