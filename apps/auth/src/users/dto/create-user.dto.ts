import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsUUID()
  roleId: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  privilegeIds: string[];
}
