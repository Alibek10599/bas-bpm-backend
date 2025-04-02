import { TaskType } from '../../../infrastructure/enums/task-types.enum';

export class UpdateTask {
  workflowInstanceId?: string;
  name?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
  metadata?: any;
  type?: TaskType;
  tenantId?: string;
}
