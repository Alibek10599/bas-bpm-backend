import { Inject, Injectable } from '@nestjs/common';
import { TEMPLATES_REPOSITORY_TOKEN } from '../domain/repository/templates.repository.token';
import { TemplatesRepository } from '../domain/repository/templates.repository';
import { EmailTemplatesEnum } from '../shared/enums/email.templates.enum';
import { Languages } from '../../shared/languages/languages.enum';
import { Template } from '../infrastructure/email/types/template';

@Injectable()
export class TemplatesService {
  constructor(
    @Inject(TEMPLATES_REPOSITORY_TOKEN)
    private readonly templatesRepository: TemplatesRepository,
  ) {}

  findEmailTemplate(template: EmailTemplatesEnum, lang: Languages): Template {
    return this.templatesRepository.findEmailTemplate(template, lang);
  }

  applyVariables(
    template: Template,
    vars: Record<string, string | number>,
  ): Template {
    template.subject = this.fillVariables(template.subject, vars);
    template.html = this.fillVariables(template.html, vars);
    return template;
  }

  private fillVariables(
    text: string,
    vars: Record<string, string | number>,
  ): string {
    for (const key in vars) {
      text = text.replace(new RegExp(`{{${key}}}`), `${vars[key]}`);
    }
    return text;
  }
}
