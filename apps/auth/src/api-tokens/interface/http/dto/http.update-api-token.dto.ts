import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AccessesModel } from '@app/common';

export class HttpUpdateApiTokenDto {
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
