import { Type } from '@nestjs/common';
import { DocumentsProvider } from './documents/documents.provider';

export class OnlyOfficeApiModuleOptions {
  imports?: any[];
  documentsProvider: Type<DocumentsProvider>;
  jwtSecret?: string;
}
