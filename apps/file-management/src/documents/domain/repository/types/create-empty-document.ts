import { DocumentTypes } from '../../../infrastructure/enums/document-types.enum';

export class CreateEmptyDocument {
  name: string;
  documentType: DocumentTypes;
  userId: string;
  tenantId: string;
}
