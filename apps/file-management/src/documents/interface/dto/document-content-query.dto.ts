import { IsNumberString } from 'class-validator';

export class DocumentContentQueryDto {
  @IsNumberString()
  version: string;
}
