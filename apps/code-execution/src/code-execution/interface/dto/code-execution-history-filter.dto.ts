import { IsUUID } from 'class-validator';

export class CodeExecutionHistoryFilterDto {
  @IsUUID()
  scriptId: string;
  @IsUUID()
  userId: string;
}
