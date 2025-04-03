import { ValueTransformer } from 'typeorm';
import { TaskType } from '../../../enums/task-types.enum';

export class TaskTypeTransformer implements ValueTransformer {
  from(value: string): TaskType {
    switch (value) {
      case TaskType.GENERAL:
        return TaskType.GENERAL;
      case TaskType.WORKFLOW:
        return TaskType.WORKFLOW;
      default:
        throw new Error(`Unknown task type: ${value}`);
    }
  }

  to(value: TaskType): string {
    return value as string;
  }
}
