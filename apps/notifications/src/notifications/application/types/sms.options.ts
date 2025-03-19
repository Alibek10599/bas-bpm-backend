import { IsOptional, IsString, Validate } from 'class-validator';
import { IsRecordStringToStrOrNum } from '../../../shared/validators/record-string-to-str-or-num.validator';

export class SmsOptions {
  @IsString()
  phone: string;

  @IsOptional()
  @Validate(IsRecordStringToStrOrNum)
  variables: Record<string, string | number>;
}
