export class CreateTask {
  workflowInstanceId?: string;

  name: string;

  description?: string;

  status?: string;

  type: string;

  assignedTo: string;

  userId: string;

  tenantId: string;
}
