import { IsObject, IsUUID } from 'class-validator';

export class ExecuteScriptDto {
  @IsUUID()
  scriptId: string;

  @IsObject()
  context: any;
}
