import { IsNumber, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  name: string;
  @IsString()
  type: string;
  @IsString()
  documentType: string;
  @IsNumber()
  size: number;
  @IsString()
  hashName: string;
}
