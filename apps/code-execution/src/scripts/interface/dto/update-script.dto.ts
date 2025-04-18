import { PartialType } from '@nestjs/mapped-types';
import { CreateScriptDto } from './create-script.dto';
import { IsUUID } from 'class-validator';

export class UpdateScriptDto extends PartialType(CreateScriptDto) {
  @IsUUID()
  scriptId: string;
}
