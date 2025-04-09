import { ValueTransformer } from 'typeorm';
import { DocumentPermissionsEnum } from '../../../enums/document-permissions.enum';

export class DocumentPermissionsTransformer implements ValueTransformer {
  to(data: string): DocumentPermissionsEnum {
    return data as DocumentPermissionsEnum;
  }

  from(data: DocumentPermissionsEnum): string {
    return data;
  }
}
