import { Injectable } from '@nestjs/common';
import { EmailTemplatesEnum } from '../shared/enums/email.templates.enum';
import { Languages } from '../../shared/languages/languages.enum';
import { Template } from '../infrastructure/email/types/template';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplatesService {
  findEmailTemplate(template: EmailTemplatesEnum, lang: Languages): Template {
    switch (template) {
      case EmailTemplatesEnum.WELCOME:
        return this.getEmailWelcomeTemplate(lang);
      case EmailTemplatesEnum.FORGOT_PASSWORD:
        return this.getEmailForgotPasswordTemplate(lang);
    }
  }

  private getEmailWelcomeTemplate(lang: Languages) {
    return {
      subject: lang === 'en' ? 'Welcome!' : 'Добро пожаловать!',
      html:
        lang === 'en'
          ? readFileSync(
              join(
                __dirname,
                'templates/infrastructure/email/templates/welcome.en.html',
              ),
            ).toString()
          : readFileSync(
              join(
                __dirname,
                'templates/infrastructure/email/templates/welcome.ru.html',
              ),
            ).toString(),
    };
  }

  private getEmailForgotPasswordTemplate(lang: Languages) {
    return {
      subject: lang === 'en' ? 'Password recovery!' : 'Восстановление пароля!',
      html:
        lang === 'en'
          ? readFileSync(
              join(
                __dirname,
                'templates/infrastructure/email/templates/forgot-password.en.html',
              ),
            ).toString()
          : readFileSync(
              join(
                __dirname,
                'templates/infrastructure/email/templates/forgot-password.ru.html',
              ),
            ).toString(),
    };
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
