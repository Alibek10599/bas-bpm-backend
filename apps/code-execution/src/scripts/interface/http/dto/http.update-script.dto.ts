import { OmitType } from '@nestjs/mapped-types';
import { UpdateScriptDto } from '../../dto/update-script.dto';

export class HttpUpdateScriptDto extends OmitType(UpdateScriptDto, [
  'scriptId',
]) {}
