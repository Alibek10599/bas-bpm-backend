import { ValueTransformer } from 'typeorm';
import { TaskStatuses } from '../../../enums/task-statuses.enum';

export class TaskStatusTransformer implements ValueTransformer {
  from(value: string): TaskStatuses {
    switch (value) {
      case TaskStatuses.PENDING:
        return TaskStatuses.PENDING;
      case TaskStatuses.IN_PROGRESS:
        return TaskStatuses.IN_PROGRESS;
      case TaskStatuses.COMPLETED:
        return TaskStatuses.COMPLETED;
      default:
        throw new Error(`Unknown task status: ${value}`);
    }
  }

  to(value: TaskStatuses): string {
    return value as string;
  }
}
