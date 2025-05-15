import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApiTokenAccessType } from '../../domain/enums/api-token-access-type.enum';

export class CreateApiTokenDto {
  @IsString()
  name: string;

  @IsEnum(ApiTokenAccessType)
  accessType: ApiTokenAccessType;

  @IsOptional()
  @IsISO8601()
  expiredAt: string;
}
