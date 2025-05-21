import { IsOptional, IsString } from 'class-validator';

export class FindAllScriptsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
