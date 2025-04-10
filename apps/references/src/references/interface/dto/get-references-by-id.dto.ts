import { IsString } from 'class-validator';

export class GetReferencesByIdDto {
  @IsString()
  referenceId: string;
}
