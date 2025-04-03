import { TaskType } from '../../infrastructure/enums/task-types.enum';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsString()
  workflowInstanceId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @IsOptional()
  @IsObject()
  metadata?: any;
}
