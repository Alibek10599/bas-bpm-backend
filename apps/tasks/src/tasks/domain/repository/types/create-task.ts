export class CreateTask {
  workflow_instance_id?: string;

  name: string;

  description?: string;

  status?: string;

  type: string;

  assigned_to: string;

  metadata: any;

  user_id: string;

  tenant_id: string;
}
