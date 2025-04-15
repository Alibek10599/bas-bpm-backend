import { IsIn, IsString } from 'class-validator';

export class CreateEmptyFileDto {
  @IsString()
  name: string;

  @IsIn(['docx', 'pptx', 'xlsx'])
  type: 'docx' | 'pptx' | 'xlsx';

  userId: string;
  tenantId: string;
}
