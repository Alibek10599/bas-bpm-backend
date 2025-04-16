import { IsIn, IsString } from 'class-validator';

export class CreateEmptyFileDto {
  @IsString()
  name: string;

  @IsIn(['docx', 'pptx', 'xlsx'])
  documentType: 'docx' | 'pptx' | 'xlsx';
}
