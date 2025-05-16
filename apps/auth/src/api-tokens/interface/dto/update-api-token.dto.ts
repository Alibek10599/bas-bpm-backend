import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccessesModel } from '@app/common';

export class UpdateApiTokenDto {
  @IsUUID()
  apiTokenId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsNumber()
  actorId: string;

  @Type(() => AccessesModel)
  @ValidateNested()
  accesses: AccessesModel;

  @IsOptional()
  @IsISO8601()
  expiredAt?: string;
}
