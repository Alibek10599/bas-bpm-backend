import { IsUUID } from 'class-validator';

export class CompleteTaskDto {
  @IsUUID()
  taskId: string;
}
