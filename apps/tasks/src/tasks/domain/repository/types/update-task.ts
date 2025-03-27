import { TaskType } from '../../../infrastructure/enums/task-types.enum';

export class UpdateTask {
  workflowInstanceId?: string;
  name?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
  type?: TaskType;
  metadata?: any;
  tenantId?: string;
}
