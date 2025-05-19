import { IsUUID } from 'class-validator';

export class ApiTokenTokenDto {
  @IsUUID()
  token: string;
}
