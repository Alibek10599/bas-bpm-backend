import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Updated name of the document',
    example: 'updated-report.docx',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated description of the document',
    example: 'Updated annual financial report',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Updated document type/category',
    example: 'financial-reports',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;
}
