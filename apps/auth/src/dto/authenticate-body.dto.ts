import { IsString } from 'class-validator';

export class AuthenticateBodyDto {
  @IsString()
  token: string;
}
