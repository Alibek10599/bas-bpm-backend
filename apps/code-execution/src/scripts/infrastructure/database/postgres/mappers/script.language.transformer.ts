import { ValueTransformer } from 'typeorm';
import { ProgrammingLanguages } from '../../../enums/programming-languages.enum';

export class ScriptLanguageTransformer implements ValueTransformer {
  from(value: string): ProgrammingLanguages {
    return value as ProgrammingLanguages;
  }

  to(value: ProgrammingLanguages): string {
    return value;
  }
}
