import { IsString } from 'class-validator';

export class RequestMetadata {
  @IsString()
  userId: string;
  @IsString()
  tenantId: string;
}
