import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Name of the document',
    example: 'report.docx',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the document',
    example: 'Annual financial report',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type/category of the document',
    example: 'financial',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Document type',
    example: 'pdf',
  })
  @IsString()
  documentType: string;

  @ApiProperty({
    description: 'Size of the document in bytes',
    example: 1024,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    description: 'Hash name of the document',
    example: 'abc123',
  })
  @IsString()
  hashName: string;
}
