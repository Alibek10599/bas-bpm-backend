export class CreateEmptyDocument {
  name: string;
  documentType: 'docx' | 'pptx' | 'xlsx';
  userId: string;
  tenantId: string;
}
