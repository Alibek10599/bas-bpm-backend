import { IsEmail, IsEnum, IsOptional, Validate } from 'class-validator';
import { EmailTemplatesEnum } from '../../../templates/shared/enums/email.templates.enum';
import { IsRecordStringToStrOrNum } from '../../../shared/validators/record-string-to-str-or-num.validator';

export class EmailOptions {
  @IsEnum(EmailTemplatesEnum)
  templateId: EmailTemplatesEnum;

  @IsEmail()
  receiverEmail: string;

  @IsOptional()
  @Validate(IsRecordStringToStrOrNum)
  variables: Record<string, string>;
}
