import { IsUUID } from 'class-validator';

export class ApiTokenIdDto {
  @IsUUID()
  apiTokenId: string;
}
