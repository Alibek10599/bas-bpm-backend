import { OmitType } from '@nestjs/mapped-types';
import { UpdatePrivilegeDto } from '../../dto/update-privilege.dto';

export class HttpUpdatePrivilegeDto extends OmitType(UpdatePrivilegeDto, [
  'privilegeId',
]) {}
