import { PartialType } from '@nestjs/mapped-types';
import { CreateApiToken } from './create-api-token';

export class UpdateApiToken extends PartialType(CreateApiToken) {}
