import { IsNumber, IsString } from 'class-validator';

export class RequestMetadata {
  @IsNumber()
  userId: number;

  @IsString()
  tenantId: string;
}
