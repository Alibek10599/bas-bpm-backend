import { IsString } from 'class-validator';

export class AssignTaskDto {
  @IsString()
  taskId: string;

  @IsString()
  assignedTo: string;
}
