import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DocumentContentQueryDto {
  @ApiProperty({
    description: 'Version of the document to retrieve',
    example: '1',
    required: false,
  })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({
    description: 'Download type (e.g., "attachment" or "inline")',
    example: 'attachment',
    required: false,
  })
  @IsString()
  @IsOptional()
  download?: string;
}
