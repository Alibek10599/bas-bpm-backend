import { CreateScript } from './create-script';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateScript extends PartialType(CreateScript) {}
