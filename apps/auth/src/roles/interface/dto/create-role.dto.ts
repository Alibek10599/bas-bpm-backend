import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parent?: string;
}
