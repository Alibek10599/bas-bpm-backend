import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { TEMPLATES_REPOSITORY_TOKEN } from '../domain/repository/templates.repository.token';
import { TemplatesRepository } from '../domain/repository/templates.repository';
import { Template } from '../infrastructure/email/types/template';
import { EmailTemplatesEnum } from '../shared/enums/email.templates.enum';
import { Languages } from '../../shared/languages/languages.enum';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let templatesRepository: TemplatesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: TEMPLATES_REPOSITORY_TOKEN,
          useValue: { findEmailTemplate: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    templatesRepository = module.get<TemplatesRepository>(
      TEMPLATES_REPOSITORY_TOKEN,
    );
  });

  /*** 1️⃣ Тест поиска шаблона ***/
  it('should find email template', () => {
    const mockTemplate: Template = { subject: 'Hello', html: '<p>Test</p>' };
    (templatesRepository.findEmailTemplate as jest.Mock).mockReturnValue(
      mockTemplate,
    );

    const result = service.findEmailTemplate(
      EmailTemplatesEnum.WELCOME,
      Languages.en,
    );

    expect(result).toEqual(mockTemplate);
    expect(templatesRepository.findEmailTemplate).toHaveBeenCalledWith(
      EmailTemplatesEnum.WELCOME,
      Languages.en,
    );
  });

  /*** 2️⃣ Тест подстановки переменных ***/
  it('should replace variables in template', () => {
    const template: Template = {
      subject: 'Hello, {{name}}',
      html: '<p>Your code: {{code}}</p>',
    };
    const vars = { name: 'Vitaliy', code: 1234 };

    const result = service.applyVariables(template, vars);

    expect(result.subject).toBe('Hello, Vitaliy');
    expect(result.html).toBe('<p>Your code: 1234</p>');
  });

  /*** 3️⃣ Тест: если переменная отсутствует ***/
  it('should not modify template if variable is missing', () => {
    const template: Template = {
      subject: 'Hello, {{name}}',
      html: '<p>Welcome</p>',
    };
    const vars = {};

    const result = service.applyVariables(template, vars);

    expect(result.subject).toBe('Hello, {{name}}');
    expect(result.html).toBe('<p>Welcome</p>');
  });

  /*** 4️⃣ Тест: если шаблон пустой ***/
  it('should return empty template if given an empty template', () => {
    const template: Template = { subject: '', html: '' };
    const vars = { name: 'Vitaliy' };

    const result = service.applyVariables(template, vars);

    expect(result.subject).toBe('');
    expect(result.html).toBe('');
  });

  /*** 5️⃣ Тест: множественная замена переменных ***/
  it('should replace multiple occurrences of the same variable', () => {
    const template: Template = {
      subject: 'Hi {{name}}, {{name}}!',
      html: 'Hello {{name}}!',
    };
    const vars = { name: 'Vitaliy' };

    const result = service.applyVariables(template, vars);

    expect(result.subject).toBe('Hi Vitaliy, Vitaliy!');
    expect(result.html).toBe('Hello Vitaliy!');
  });

  /*** 6️⃣ Тест: некорректные переменные ***/
  it('should handle null and undefined variables gracefully', () => {
    const template: Template = {
      subject: 'Hello, {{name}}',
      html: '<p>Code: {{code}}</p>',
    };
    const vars = { name: null, code: undefined };

    const result = service.applyVariables(template, vars);

    expect(result.subject).toBe('Hello, null');
    expect(result.html).toBe('<p>Code: undefined</p>');
  });

  /*** 7️⃣ Тест: конфликт переменных (user vs username) ***/
  it('should not replace partially matching variable names', () => {
    const template: Template = {
      subject: 'Hello, {{user}}',
      html: '<p>Welcome, {{username}}</p>',
    };
    const vars = { user: 'Vitaliy' };

    const result = service.applyVariables(template, vars);

    expect(result.subject).toBe('Hello, Vitaliy');
    expect(result.html).toBe('<p>Welcome, {{username}}</p>');
  });
});
