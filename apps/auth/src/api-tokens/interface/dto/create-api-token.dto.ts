import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AccessesModel } from '@app/common';
import { Type } from 'class-transformer';

export class CreateApiTokenDto {
  @IsString()
  name: string;

  @IsNumber()
  actorId: number;

  @Type(() => AccessesModel)
  @ValidateNested()
  accesses: AccessesModel;

  @IsOptional()
  @IsISO8601()
  expiredAt: string;
}
