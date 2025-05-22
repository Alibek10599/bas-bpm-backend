import { IsOptional, IsString } from 'class-validator';

export class FindAllApiTokenFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
