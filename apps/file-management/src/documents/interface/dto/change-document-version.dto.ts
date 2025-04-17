import { IsString } from 'class-validator';
import { DocumentIdDto } from './document-id.dto';

export class ChangeDocumentVersionDto extends DocumentIdDto {
  @IsString()
  versionId: string;
}
