import { IsUUID } from 'class-validator';

export class PrivilegeIdDto {
  @IsUUID()
  privilegeId: string;
}
