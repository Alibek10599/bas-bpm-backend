import { IsString } from 'class-validator';

export class ChangeDocumentVersionDto {
  @IsString()
  versionId: string;
}
