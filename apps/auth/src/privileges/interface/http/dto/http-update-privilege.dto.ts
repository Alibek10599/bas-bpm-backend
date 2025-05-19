import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AccessesModel } from '@app/common';

export class HttpUpdatePrivilegeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AccessesModel)
  accesses: AccessesModel;
}
