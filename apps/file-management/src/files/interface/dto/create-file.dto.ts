import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    description: 'Name of the file',
    example: 'document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Type/MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Document type extension',
    example: 'pdf',
  })
  @IsString()
  documentType: string;

  @ApiProperty({
    description: 'File content as Buffer',
    type: 'string',
    format: 'binary',
  })
  buffer: Buffer;

  @ApiProperty({
    description: 'User ID of the file owner',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Tenant ID of the file owner',
    example: 'tenant-123',
  })
  tenantId: string;
}
