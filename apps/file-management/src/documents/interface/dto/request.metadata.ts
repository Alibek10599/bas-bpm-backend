import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RequestMetadata {
  @ApiProperty({
    description: 'User ID of the requester',
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Tenant ID of the requester',
    example: 'tenant-123',
  })
  @IsString()
  tenantId: string;

  @ApiProperty({
    description: 'Type of the file/document',
    example: 'reports',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Name of the file/document',
    example: 'financial-report.pdf',
  })
  @IsString()
  name: string;
}
