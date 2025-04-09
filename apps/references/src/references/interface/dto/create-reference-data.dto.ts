import { IsString } from 'class-validator';

export class CreateReferenceDataDto {
  @IsString()
  type: string;

  @IsString()
  key: string;

  @IsString()
  value: string;
}
