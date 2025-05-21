import { ProgrammingLanguages } from '../../../infrastructure/enums/programming-languages.enum';

export class CreateScript {
  name: string;
  script: string;
  language: ProgrammingLanguages;
  tenantId: string;
  userId: string;
}
