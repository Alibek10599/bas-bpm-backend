import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReferenceDataDto } from './create-reference-data.dto';

export class CreateReferenceDto {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateReferenceDataDto)
  referenceData: CreateReferenceDataDto[];
}
