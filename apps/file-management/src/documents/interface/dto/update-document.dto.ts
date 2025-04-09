import { CreateDocumentDto } from './create-document.dto';

export class UpdateDocumentDto extends CreateDocumentDto {
  documentId: string;
}
