import { IsString } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  name: string;

  @IsString()
  script: string;
}
