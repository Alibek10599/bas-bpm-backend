import { EmailTemplatesEnum } from '../../shared/enums/email.templates.enum';
import { Languages } from '../../../shared/languages/languages.enum';
import { Template } from '../../infrastructure/email/types/template';

export interface TemplatesRepository {
  findEmailTemplate(template: EmailTemplatesEnum, lang: Languages): Template;
}
