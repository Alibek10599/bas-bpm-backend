import { IsString, ValidateNested } from 'class-validator';
import { AccessesModel } from '../../infrastructure/types/accesses-model';
import { Type } from 'class-transformer';

export class CreatePrivilegeDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AccessesModel)
  accesses: AccessesModel;
}
