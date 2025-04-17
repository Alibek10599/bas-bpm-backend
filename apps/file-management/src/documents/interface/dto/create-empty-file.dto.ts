import { IsEnum, IsString } from 'class-validator';
import { DocumentTypes } from '../../infrastructure/enums/document-types.enum';

export class CreateEmptyFileDto {
  @IsString()
  name: string;

  @IsEnum(DocumentTypes)
  documentType: DocumentTypes;
}
