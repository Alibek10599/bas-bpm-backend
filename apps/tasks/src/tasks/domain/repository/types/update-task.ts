import { TaskType } from '../../../infrastructure/enums/task-types.enum';

export class UpdateTask {
  workflow_instance_id?: string;
  name?: string;
  description?: string;
  status?: string;
  assigned_to?: string;
  type?: TaskType;
  metadata?: any;
  tenant_id?: string;
}
