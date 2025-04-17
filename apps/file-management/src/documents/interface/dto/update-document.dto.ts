import { CreateDocumentDto } from './create-document.dto';
import { IsString } from 'class-validator';

export class UpdateDocumentDto extends CreateDocumentDto {
  @IsString()
  documentId: string;
}
