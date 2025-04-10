import { UpdateReferenceDto } from '../../dto/update-reference.dto';
import { OmitType } from '@nestjs/mapped-types';

export class HttpUpdateReferenceDto extends OmitType(UpdateReferenceDto, [
  'referenceId',
]) {}
