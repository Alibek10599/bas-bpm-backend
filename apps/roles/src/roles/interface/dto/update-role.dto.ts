import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsUUID()
  parent?: string;
}
