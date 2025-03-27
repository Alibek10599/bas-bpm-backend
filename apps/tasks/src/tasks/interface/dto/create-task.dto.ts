import { TaskType } from '../../infrastructure/enums/task-types.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsEnum(TaskType)
  type: TaskType;

  @IsOptional()
  @IsString()
  workflowInstanceId: string;

  @IsOptional()
  @IsOptional()
  metadata: any;
}
