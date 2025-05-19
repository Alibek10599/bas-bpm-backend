import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AccessesModel } from '@app/common';

export class CreatePrivilegeDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AccessesModel)
  accesses: AccessesModel;
}
