import { IsEnum, IsString } from 'class-validator';
import { ProgrammingLanguages } from '../../infrastructure/enums/programming-languages.enum';

export class CreateScriptDto {
  @IsString()
  name: string;

  @IsString()
  script: string;

  @IsEnum(ProgrammingLanguages)
  language: ProgrammingLanguages;
}
