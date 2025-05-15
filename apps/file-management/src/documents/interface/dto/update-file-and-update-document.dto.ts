import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFileAndUpdateDocumentDto {
  @ApiProperty({
    description: 'Updated name of the document',
    example: 'updated-report-v2.docx',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated description of the document',
    example: 'Updated Q4 2024 Business Report with corrections',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Updated type/category of the document',
    example: 'business-reports-final',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Updated MIME type of the file',
    example:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    required: false,
  })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiProperty({
    description: 'Updated size of the file in bytes',
    example: 16384,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiProperty({
    description: 'Updated hash name for the file',
    example: 'd4e5f6a7b8c9',
    required: false,
  })
  @IsString()
  @IsOptional()
  hashName?: string;
}
