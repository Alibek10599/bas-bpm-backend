import { IsString } from 'class-validator';

export class MessageMetadata {
  @IsString()
  tenantId: string;

  @IsString()
  userId: string;
}
