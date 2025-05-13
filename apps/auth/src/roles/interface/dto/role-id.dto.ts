import { IsString } from 'class-validator';

export class RoleIdDto {
  @IsString()
  roleId: string;
}
