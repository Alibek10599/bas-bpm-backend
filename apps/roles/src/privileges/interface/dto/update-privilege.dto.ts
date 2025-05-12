import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivilegeDto } from './create-privilege.dto';
import { IsUUID } from 'class-validator';

export class UpdatePrivilegeDto extends PartialType(CreatePrivilegeDto) {
  @IsUUID()
  privilegeId: string;
}
