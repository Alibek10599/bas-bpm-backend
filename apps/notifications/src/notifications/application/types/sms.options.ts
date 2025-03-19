import { IsEnum, IsString, Validate } from 'class-validator';
import { EmailTemplatesEnum } from '../../../templates/shared/enums/email.templates.enum';
import { IsRecordStringToStrOrNum } from '../../../shared/validators/record-string-to-str-or-num.validator';

export class SmsOptions {
  @IsString()
  phone: string;

  @Validate(IsRecordStringToStrOrNum)
  variables: Record<string, string | number>;
}
