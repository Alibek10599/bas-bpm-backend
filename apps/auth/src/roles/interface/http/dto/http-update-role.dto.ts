import { OmitType } from '@nestjs/mapped-types';
import { UpdateRoleDto } from '../../dto/update-role.dto';

export class HttpUpdateRoleDto extends OmitType(UpdateRoleDto, ['roleId']) {}
