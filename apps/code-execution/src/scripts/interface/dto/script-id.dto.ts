import { IsUUID } from 'class-validator';

export class ScriptIdDto {
  @IsUUID()
  scriptId: string;
}
