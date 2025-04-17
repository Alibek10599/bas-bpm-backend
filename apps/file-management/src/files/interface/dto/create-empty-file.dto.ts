import { IsEnum, IsString } from 'class-validator';
import { DocumentTypes } from '../../../documents/infrastructure/enums/document-types.enum';

export class CreateEmptyFileDto {
  @IsString()
  name: string;

  @IsEnum(DocumentTypes)
  type: DocumentTypes;

  userId: string;
  tenantId: string;
}
