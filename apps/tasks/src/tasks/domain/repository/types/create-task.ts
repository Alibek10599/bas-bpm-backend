export class CreateTask {
  workflowInstanceId?: string;

  name: string;

  description?: string;

  status?: string;

  type: string;

  assignedTo: string;

  metadata: any;

  userId: string;

  tenantId: string;
}
