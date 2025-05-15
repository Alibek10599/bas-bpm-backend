import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiTokenAccessType } from '../../domain/enums/api-token-access-type.enum';

export class UpdateApiTokenDto {
  @IsUUID()
  apiTokenId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ApiTokenAccessType)
  accessType: ApiTokenAccessType;

  @IsOptional()
  @IsISO8601()
  expiredAt?: string;
}
