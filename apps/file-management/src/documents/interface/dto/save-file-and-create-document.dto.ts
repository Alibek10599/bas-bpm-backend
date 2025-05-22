import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveFileAndCreateDocumentDto {
  @ApiProperty({
    description: 'Name of the document',
    example: 'business-report.docx',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the document',
    example: 'Q4 2024 Business Report',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type/category of the document',
    example: 'business-reports',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 15360,
  })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    description: 'Hash name for storing the file',
    example: 'f7d9a1b3e5c2',
  })
  @IsString()
  @IsNotEmpty()
  hashName: string;
}
