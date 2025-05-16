import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDto implements Partial<CreateUserDto> {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsUUID()
  roleId: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  privilegeIds: string[];
}
